const { dialog } = require('electron');
const fs = require('fs').promises;
const JSZip = require('jszip');
const path = require('node:path');
const util = require('node:util');
const { execFile } = require('child_process');
const xml2js = require('xml2js');

export async function extractPanxToAppData(pfuFolderPath, appDataDir) {
  try {
    // Step 1: Open a file dialog to select a .panx file
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'PANX Files', extensions: ['panx'] }],
    });

    if (canceled || filePaths.length === 0) {
      console.log('No file selected');
      return;
    }

    const zipFilePath = filePaths[0];
    console.log(`Selected file: ${zipFilePath}`);

    // Step 2: Unzip the file using JSZip
    const zipData = await fs.readFile(zipFilePath);
    const zip = await JSZip.loadAsync(zipData);

    // Step 3: Extract all files and directories
    const tasks = Object.keys(zip.files).map(async (relativePath) => {
      const entry = zip.files[relativePath];
      const outputPath = path.join(appDataDir, relativePath);

      if (entry.dir) {
        // Create directories
        await fs.mkdir(outputPath, { recursive: true });
        // console.log(`Directory created: ${outputPath}`);
      } else {
        // Write files
        const fileData = await entry.async('nodebuffer'); // Get raw file data
        await fs.mkdir(path.dirname(outputPath), { recursive: true }); // Ensure parent directories exist
        await fs.writeFile(outputPath, fileData);
        // console.log(`File saved: ${outputPath}`);
      }
    });

    // Wait for all tasks to complete
    await Promise.all(tasks);
    console.log('All files extracted successfully!');

    // Make directory for exe output
    const exeOutDir = await ensureDirectoryExists(
      path.join(appDataDir, 'exe_output')
    );

    // Path to exe
    const exePath = path.join(pfuFolderPath, 'PanelFileGenerator.exe');

    // Find path to extracted pan
    const panInPath = await findPanFile(appDataDir);

    // Extract the filename and add '-OUT' before the extension
    const panFileName = path.basename(panInPath, path.extname(panInPath)); // Get the filename without the extension
    const panOut = `${panFileName}-OUT${path.extname(panInPath)}`; // Append '-OUT' and add the extension back
    const panOutPath = path.join(exeOutDir, panOut);
    const changesPath = path.join(pfuFolderPath, 'blank-changes.xml');
    const logPath = path.join(exeOutDir, 'pan_log.txt');

    console.log(exePath);
    console.log(panInPath);
    console.log(panOutPath);
    console.log(changesPath);
    console.log(logPath);

    // Array of arguments (commands) to pass to the .exe
    const exeArgs = [
      '-i',
      panInPath,
      '-o',
      panOutPath,
      '-c',
      changesPath,
      '-f',
      logPath,
    ];

    await runExeAndMonitorStatus(exePath, exeArgs);
    console.log('The .exe has finished running.');

    const parsedXmlObjects = await processXmlFiles(exeOutDir); // Get parsed XML objects
    const panObj = parsedXmlObjects[0].points.point;
    // console.log(
    //   util.inspect(panObj, {
    //     showHidden: false,
    //     depth: null,
    //     colors: true,
    //   })
    // );

    const sections = [
      { key: 'panObjects', label: 'All Objects' },
      {
        key: 'panSystemGroups',
        label: 'System Groups',
        groupType: { panSystemGroups: ['GRP'] },
      },
      {
        key: 'panInputs',
        label: 'Inputs',
        groupType: { panInputs: ['BI', 'AI'] },
      },
      {
        key: 'panOutputs',
        label: 'Outputs',
        groupType: { panOutputs: ['AO', 'BO', 'MO'] },
      },
      {
        key: 'panValues',
        label: 'Values',
        groupType: { panValues: ['AV', 'BV', 'MV'] },
      },
    ];

    // Mapping of full types to short forms
    const typeMapping = {
      PROGRAM: 'PRG',
      SINGLETREND: 'STL',
      MULTITREND: 'MTL',
      ANALOGINPUT: 'AI',
      ANALOGOUTPUT: 'AO',
      ANALOGVALUE: 'AV',
      ARRAY: 'AY',
      BINARYINPUT: 'BI',
      BINARYOUTPUT: 'BO',
      BINARYVALUE: 'BV',
      CALENDAR: 'CAL',
      LOOP: 'LOOP',
      MULTISTATEOUTPUT: 'MO',
      MULTISTATEVALUE: 'MV',
      SYSTEMGROUP: 'GRP',
      SMARTSENSOR: 'SS',
      TABLE: 'TBL',
      SCHEDULE: 'SCHED',
    };

    // Define the groups and their short types
    const groups = {
      panSystemGroups: ['GRP'],
      panInputs: ['BI', 'AI'],
      panOutputs: ['AO', 'BO', 'MO'],
      panValues: ['AV', 'BV', 'MV'],
      panLoops: ['LOOP'],
      panCalendars: ['CAL'],
      panMultipointTrendLogs: ['MTL'],
      panSingleTrendLogs: ['STL'],
      panPrograms: ['PRG'],
      panArrays: ['AY'],
      panTables: ['TBL'],
      panSmartSensor: ['SS'],
      panSchedules: ['SCHED'],
    };

    const typedData = panObj.map((item) => ({
      ...item,
      panObj: `${typeMapping[item.type]}${item.instance}`,
    }));

    // Grouping and transforming function
    // const groupedData = panObj.reduce((acc, item) => {
    //   const shortType = typeMapping[item.type];
    //   const newType = shortType ? `${shortType}${item.instance}` : item.type;

    //   // Find the appropriate group for the short type
    //   const groupKey = Object.keys(groups).find((key) =>
    //     groups[key].includes(shortType)
    //   );

    //   if (groupKey) {
    //     if (!acc[groupKey]) acc[groupKey] = [];
    //     acc[groupKey].push({ ...item, type: newType });
    //   } else {
    //     if (!acc.Unmapped) acc.Unmapped = []; // Handle unmapped types
    //     acc.Unmapped.push(item);
    //   }

    //   return acc;
    // }, {});

    console.log(
      '--------------------------------------------------------------------------'
    );
    console.log(typedData[0]);

    return typedData; // Return the root extraction directory
  } catch (error) {
    console.error('Error extracting .panx file:', error.message);
    throw error;
  }
}

async function findPanFile(directory) {
  try {
    // Read the contents of the directory
    const files = await fs.readdir(directory);

    // Look for a file with a .pan extension
    const panFile = files.find((file) => path.extname(file) === '.pan');

    if (panFile) {
      // Return the full path to the .pan file
      console.log(`found .pan file in: ${panFile}`);
      return path.join(directory, panFile);
    } else {
      console.log('No .pan file found in the directory.');
      return null;
    }
  } catch (error) {
    console.error('Error reading directory:', error);
    return null;
  }
}

// Ensure the directory exists, creating it if necessary
async function ensureDirectoryExists(directory) {
  try {
    await fs.mkdir(directory, { recursive: true }); // Create the directory if it doesn't exist
    console.log(`Directory ensured: ${directory}`);
    return directory; // Return the directory path
  } catch (error) {
    console.error(`Error creating directory: ${error.message}`);
    throw error; // Propagate the error if directory creation fails
  }
}

/**
 * Runs an executable file and monitors its exit status.
 * @param {string} exePath - The path to the executable file.
 * @param {string[]} args - The array of arguments to pass to the executable.
 * @returns {Promise<void>} Resolves when the process exits with status code 0.
 * @throws {Error} Throws an error if the process exits with a non-zero code or an error occurs.
 */
// TODO : OPTIMIZE THIS BY EXTRACTING ONLY PAN, RUN EXE IN PARALLEL TO EXTRACTING THE REST
async function runExeAndMonitorStatus(exePath, args = []) {
  return new Promise((resolve, reject) => {
    execFile(exePath, args, (error, stdout, stderr) => {
      if (error) {
        reject(
          new Error(
            `Process failed with code ${error.code}: ${stderr || error.message}`
          )
        );
        return;
      }

      // Log stderr if available (for errors)
      if (stderr) {
        console.error(`STDERR: ${stderr}`);
      }

      // Log stdout if needed
      if (stdout) {
        console.log(`STDOUT: ${stdout}`);
      }

      // If no error, the process exited successfully
      resolve();
    });
  });
}

// Function to search and replace text in XML content
function searchAndReplace(xmlData, searchString, replaceString) {
  return xmlData.replace(new RegExp(searchString, 'g'), replaceString);
}

// Function to find XML files asynchronously in the directory
async function findXmlFiles(directory) {
  try {
    const files = await fs.readdir(directory); // Read directory contents
    return files.filter((file) => path.extname(file) === '.xml'); // Return only .xml files
  } catch (err) {
    console.error(`Error reading directory ${directory}: ${err.message}`);
    throw err;
  }
}

// Function to read and convert XML files into JavaScript objects
async function readXmlFile(filePath) {
  try {
    let xmlData = await fs.readFile(filePath, 'utf8'); // Read XML file content
    xmlData = searchAndReplace(xmlData, 'log enabled', 'enabled');
    console.log('XML content after search and replace:', xmlData);

    const parser = new xml2js.Parser({
      mergeAttrs: true,
      explicitArray: false,
      // attrValueProcessors: [xml2js.processors.parseNumbers],
    }); // Create a new XML parser

    // Parse XML data into a JavaScript object
    const jsObject = await parser.parseStringPromise(xmlData);
    console.log('XML file converted to JavaScript object:', jsObject);

    return jsObject;
  } catch (err) {
    console.error(`Error reading or parsing XML file: ${err.message}`);
    throw err;
  }
}

// Function to read and process XML files asynchronously
async function processXmlFiles(directory) {
  try {
    const xmlFiles = await findXmlFiles(directory);

    const parsedXmlObjects = [];

    if (xmlFiles.length > 0) {
      for (const file of xmlFiles) {
        const filePath = path.join(directory, file);
        const parsedObject = await readXmlFile(filePath); // Convert XML file to JS object
        parsedXmlObjects.push(parsedObject); // Collect parsed objects in an array

        // try {
        //   const data = await fs.readFile(filePath, 'utf8'); // Read file content
        //   console.log(`Processing XML file: ${filePath}`);
        //   console.log(`File content:\n${data}`);

        //   // Delete file after processing
        //   await fs.unlink(filePath);
        //   console.log(`File deleted: ${filePath}`);
        // } catch (err) {
        //   console.error(`Error processing file ${filePath}: ${err.message}`);
        // }
      }
    } else {
      console.log('No XML files found to process.');
    }

    return parsedXmlObjects; // Return array of parsed JavaScript objects
  } catch (err) {
    console.error(`Error processing XML files: ${err.message}`);
    throw err; // Re-throw error to handle it in the calling function
  }
}
