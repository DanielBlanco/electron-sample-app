const electron = require("electron")
const url = require("url")
const path = require("path")

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow
let addWindow;

// True if is a Mac.
const isMac = process.platform == "darwin";

// True if prod environment.
const isProduction = process.env.NODE_ENV == "production";

// Listen for the app to be ready
app.on("ready", () => {
  // create new window
  mainWindow = new BrowserWindow({})
  //load html into the window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "main.html"),
      protocol: "file:",
      slashes: true,
    })
  )

  // Quit app when closed
  mainWindow.on("closed", () => { app.quit() })

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  // Insert menu
  Menu.setApplicationMenu(mainMenu)
})

// Handle create add window.
function createAddWindow() {
  // create new window
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add shopping list item"

  })
  //load html into the window
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "add.html"),
      protocol: "file:",
      slashes: true,
    })
  )

  //Garbage collection handle
  addWindow.on("closed", () => { addWindow = null; })
};

// Catch item:add
ipcMain.on("item:add", (e, item) => {
  console.log(item);
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

// create menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click() {
          createAddWindow()
        }
      },
      {
        label: "Clear Items",
      },
      {
        label: "Quit",
        accelerator: isMac ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit()
        },
      },
    ],
  },
]

// If mac add empty object to menu.
if (isMac) {
  mainMenuTemplate.unshift({});
}

// Add developer tools if not in production
if (isProduction) {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: isMac ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  })
}
