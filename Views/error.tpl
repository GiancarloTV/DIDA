<!DOCTYPE html>
<html lang="en">

	<head>
		<title>KPI Server {{ error_code }}</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

        <meta name="theme-color" content="#171a1b">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">

        <link rel="stylesheet" type="text/css" href="/Static/template.css">
		<link rel="stylesheet" type="text/css" href="/Static/error/styles.css">
    </head>

    <body>

        <header class="header">
            <span class="header_logo">
                <div class="header_logo_">
                    <img src="/Static/DIDA.png" alt="DIDAGROUP Logo" id="dida_logo">
                </div>
            </span>
            <p class="header_wh">DIDA</p>
            <p class="header_re">GROUP</p>
        </header>

        <main>
            <div class="main_container">
                <div class="main_data">
                    <p class="main_data_title">Oops!</p>
                    <p class="main_data_message">{{ error_message }}</p>
                    <p class="main_data_error">Error code: {{ error_code }}</p>
                    <div class="main_data_button">
                        <button class="button" onclick="location.href='/'">Go to Home Page</button>
                    </div>
                </div>
        
                <div class="main_icon">
                    <span class="symbols">&#xe8b8;</span>
                </div>
            </div>
        </main>

        <footer>
            <p>SERVER</p>
        </footer>

        <script>
            document.addEventListener("DOMContentLoaded", async function() {
                if (localStorage.getItem("theme") === "light") {
                    document.body.classList.add("light-mode-variables");
                }

                window.addEventListener("focus", () => {
                    console.log("[WINDOW] Focus");

                    let set = localStorage.getItem("theme") === "light";
                    let now = document.body.classList.contains("light-mode-variables");

                    if (set !== now) {
                        document.body.classList.toggle("light-mode-variables");
                    }
                });
            });
        </script>
        
	</body>
</html>