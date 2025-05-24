# Pesuas

**Pesuas** is the electronic health record system for the Unified Social Assistance System (SUAS) of Benjamin Constant, Amazonas, Brazil.

**Descrição em Português:**
Prontuário eletrônico do Sistema Único de Assistência Social de Benjamin Constant-AM.

---

## Author

This application was developed by **Fabrica de Plugins e Diogenes Junior**.

---

## Platform

This is a [Cordova](https://cordova.apache.org/) application, primarily targeting the **Android** platform. It is designed to be a mobile application.

---

## Technologies Used

*   **[Cordova](https://cordova.apache.org/):** Main framework for building the mobile application.
*   **[Ionic WebView Plugin](https://github.com/ionic-team/cordova-plugin-ionic-webview):** Used for rendering web content within the app.
*   **HTML5:** For structuring the application's user interface.
*   **CSS3:** For styling the application.
*   **JavaScript:** For application logic and interactivity.
*   **Bootstrap:** Front-end component library.
*   **jQuery:** JavaScript library for DOM manipulation and utility functions.

---

## Getting Started & Build Instructions

To get started with this project, you will need to have [Node.js](https://nodejs.org/) and [Cordova](https://cordova.apache.org/) installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/diogenesjup/pesuas.git
    cd pesuas
    ```

2.  **Install dependencies:**
    The `package.json` lists `cordova-android` as a dev dependency.
    ```bash
    npm install
    ```

3.  **Add Platform (if not already configured):**
    Ensure the Android platform is added to your Cordova project.
    ```bash
    cordova platform add android
    ```
    *(Note: The `config.xml` specifies `cordova-android` version `^13.0.0`.)*

4.  **Build the application:**
    ```bash
    cordova build android
    ```

5.  **Run the application:**
    You can run the application on a connected Android device or an emulator.
    ```bash
    cordova run android
    ```

*Note: Review `package.json` for any specific scripts, though none are explicitly defined for build/run commands beyond standard Cordova usage. The project uses various Cordova plugins listed in `config.xml` and `package.json` which should be installed as part of the `cordova prepare` or `cordova build` process.*

---

## Repository

The source code for this project is hosted on GitHub:
[https://github.com/diogenesjup/pesuas.git](https://github.com/diogenesjup/pesuas.git)

---

## License

This project is licensed under the **ISC License**. See the `package.json` for more details.

---
