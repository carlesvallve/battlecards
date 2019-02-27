const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const appPath = path.join(rootPath, 'release-builds')
  const outPath = path.join(rootPath, 'installers')

  return Promise.resolve({
    appDirectory: path.join(appPath, 'MovieClip Viewer-win32-ia32/'),
    authors: 'Christian Engvall',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'MovieClip Viewer.exe',
    setupExe: 'MovieClipViewerInstaller.exe',
    setupIcon: path.join(rootPath, 'assets', 'icons', 'win', 'icon.ico')
  })
}