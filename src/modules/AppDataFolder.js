const fs = require('fs').promises;
const path = require('path');

export async function createAppDataFolder(app) {
  try {
    // Step 1: Get the AppData directory
    const baseDir = path.join(app.getPath('userData'), 'instances');
    const appDataDir = path.join(
      baseDir,
      `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
    );

    // Step 2: Ensure the AppData directory exists
    await fs.mkdir(appDataDir, { recursive: true });
    console.log(`Made directory: ${appDataDir}`);

    // Step 3: Creat Lock File
    // TODO : HANDLE CASE WHERE SOMEONE OPENS ANOTHER FILE IN THE SAME SESSION.
    // TODO : REMOVE LOCK FILE IF APP IS CLOSED PROPERLY (NOT IF IT CRASHES?)
    // TODO : WHAT TO DO IF IT SOMEHOW CREATES A FILE WITH THE SAME NAME. IS THAT EVEN POSSIBLE?
    const lockFilePath = path.join(appDataDir, '.lock');
    const pid = process.pid;
    await fs.writeFile(lockFilePath, JSON.stringify({ pid }));
    console.log(`Lock file created with PID: ${pid}`);

    // Step 4: Clean up old folders (keep the 50 most recent)
    await cleanUpOldFolders(baseDir, 50);

    return appDataDir; // Return the unique extraction directory
  } catch (error) {
    console.error('Error creating AppData Folder:', error.message);
    throw error;
  }
}

async function cleanUpOldFolders(baseDir, maxFolders) {
  try {
    // Read all items in the base directory
    const items = await fs.readdir(baseDir, { withFileTypes: true });

    // Filter for directories only
    const folders = items
      .filter((item) => item.isDirectory())
      .map((item) => path.join(baseDir, item.name));

    // Get folder stats and sort by creation time (oldest first)
    const folderStats = await Promise.all(
      folders.map(async (folder) => {
        const stats = await fs.stat(folder);
        return { folder, ctime: stats.ctimeMs };
      })
    );
    folderStats.sort((a, b) => a.ctime - b.ctime);

    // Delete folders if more than `maxFolders`
    // TODO : THIS WILL GET STUCK IN A LOOP IF SOMEONE MANAGES TO OPEN 50 FILES AT A TIME
    // TODO : MAKE AN ESCAPE HATCH?
    while (folderStats.length > maxFolders) {
      const oldest = folderStats.shift();

      // Validate lock file to ensure folder is not in use
      if (await isLockFileStaleByPid(oldest.folder)) {
        console.log(`Skipping active folder: ${oldest.folder}`);
        continue;
      }

      // Delete the folder if not in use
      await fs.rm(oldest.folder, { recursive: true, force: true });
      console.log(`Deleted old folder: ${oldest.folder}`);
    }
  } catch (error) {
    console.error('Error cleaning up old AppData:', error.message);
  }
}

async function isProcessActive(pid) {
  try {
    process.kill(pid, 0); // Check if the process exists
    return true;
  } catch {
    return false;
  }
}

async function isLockFileStaleByPid(folderPath) {
  const lockFilePath = path.join(folderPath, '.lock');
  try {
    const content = await fs.readFile(lockFilePath, 'utf8');
    const { pid } = JSON.parse(content);
    return !(await isProcessActive(pid));
  } catch {
    return true; // Treat invalid or missing lock files as stale
  }
}
