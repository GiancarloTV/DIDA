<!DOCTYPE html>
<html lang="en">

    <head>

        <title>DIDA GROUP - Home</title>
        
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        
        <link rel="icon" href="/Static/favicon.ico" type="image/x-icon">
        <link rel="stylesheet" type="text/css" href="/Static/template.css">
        <link rel="stylesheet" type="text/css" href="/Static/home/styles.css">

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

        <main id="main_content">

            <div class="main_menu_ghost">

                <nav class="main_menu">
                    <div class="main_menu_title" title="Main menu">
                        <span class="symbols"> &#xe5d2; </span>
                        <p>Menu</p>
                    </div>
    
                    <div class="main_menu_company">
                        <span class="main_menu_company_logo" title="Company logo">
                            <div class="main_menu_company_logo_">
                                <img src="/Static/DIDA.png" alt="Company Logo" id="company_logo">
                            </div>
                        </span>
                        <p title="Company name" id="company_name">DIDAGROUP</p>
                    </div>
    
                    <div class="main_menu_session" id="open_session_prompt">
                        <span class="symbols" title="Log in"> &#xea77; </span>
                        <p title="Log in">Log in</p>
                    </div>
    
                    <ul class="main_menu_devices" id="main_menu">
                    </ul>

                    <ul class="main_menu_functions">
                        <li class="main_menu_function_gral" title="Select page to go" id="pages_button">
                            <span class="symbols"> &#xe069; </span>
                            <p>Go to</p>
                        </li>

                        <li class="main_menu_function_theme" title="Toggle To Light Mode" id="theme-toggler">
                            <div class="main_menu_function_theme_light">
                                <span class="symbols"> &#xe430; </span>
                                <p>Light</p>
                            </div>
    
                            <div class="main_menu_function_theme_dark">
                                <span class="symbols"> &#xef44; </span>
                                <p>Dark</p>
                            </div>
                        </li>

                        <li class="main_menu_function_time" title="Current time">
                            <span class="symbols"> &#xe307;</span>
                            <p id="current_time">12:00 a. m.</p>
                        </li>
                    </ul>
                </nav>

            </div>

            <div class="main_content">
                <div class="main_content_cards">
                    <div class="main_content_card" title="Units produced">
                        <span id="card_produced">0</span>
                        <p>Produced</p>
                    </div>

                    <div class="main_content_card" title="Units accepted">
                        <span id="card_accepted">0</span>
                        <p>Accepted</p>
                    </div>

                    <div class="main_content_card" title="Units reworked">
                        <span id="card_reworked">0</span>
                        <p>Reworked</p>
                    </div>

                    <div class="main_content_card" title="Units for scrap">
                        <span id="card_scrap">0</span>
                        <p>Scrap</p>
                    </div>
                </div>

                <div class="main_content_graphic" id="kpi_graph">
                </div>

                <div class="main_content_indicators">

                    <div class="main_content_indicators_item indicators_item-active" id="OEE_B" title="OEE Indicator (Clic to view graphic)">
                        <div class="donut" id="oee_value" data-percent="0">
                            <svg viewBox="0 0 36 36">
                            <path class="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="meter" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="percentage">0.00%</text>
                            </svg>
                            <p>OEE</p>
                        </div>
                    </div>

                    <div class="main_content_indicators_item" id="DIS_B" title="Disponibility Indicator (Clic to view graphic)">
                        <div class="donut" id="dis_value" data-percent="0">
                            <svg viewBox="0 0 36 36">
                            <path class="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="meter" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="percentage">0.00%</text>
                            </svg>
                            <p>Disponibility</p>
                        </div>
                    </div>

                    <div class="main_content_indicators_item" id="PER_B" title="Performance Indicator (Clic to view graphic)">
                        <div class="donut" id="per_value" data-percent="0">
                            <svg viewBox="0 0 36 36">
                            <path class="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="meter" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="percentage">0.00%</text>
                            </svg>
                            <p>Performance</p>
                        </div>
                    </div>

                    <div class="main_content_indicators_item" id="QUA_B" title="Quality Indicator (Clic to view graphic)">
                        <div class="donut" id="qua_value" data-percent="0">
                            <svg viewBox="0 0 36 36">
                            <path class="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="meter" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="percentage">0.00%</text>
                            </svg>
                            <p>Quality</p>
                        </div>
                    </div>

                </div>                
            </div>

            <div class="main_data_ghost">
                <nav class="main_data">

                    <div class="main_data_navegator">
                        <ul class="main_data_nav">
                            <li title="General Data" class="main_data_nav_option main_data_nav_option-active" id="gen_nav">Gen</li>
                            <li title="Disponibility Data" class="main_data_nav_option" id="dis_nav">Dis</li>
                            <li title="Performance Data" class="main_data_nav_option" id="per_nav">Per</li>
                            <li title="Quality Data" class="main_data_nav_option" id="qua_nav">Qua</li>
                        </ul>

                        <div class="main_data_window">
                            
                            <div class="main_data_window_gen main_data_window-active" id="gen_win">
                                <div class="main_data_window_title">
                                    <p>General Data</p>
                                </div>

                                <div class="main_data_window_data">

                                    <div class="main_data_window_device_state">
                                        <div class="main_data_window_device_status" title="Current device mode">
                                            <span id="monitoring_span" class="symbols"> &#xe30a; </span>
                                            <p id="monitoring_p">Stand by</p>
                                        </div>

                                        <div class="main_data_window_device_status" title="Current device connection">
                                            <span id="online_span" class="symbols"> &#xe875; </span>
                                            <p id="online_p">Offline</p>
                                        </div>
                                    </div>

                                    <div class="main_data_window_device_state">
                                        <div class="main_data_window_device_status" title="Power Supply Status">
                                            <span id="power_span" class="symbols"> &#xe646; </span>
                                            <p id="power_p">Power Supply</p>
                                        </div>

                                        <div class="main_data_window_device_status" title="Battery Status">
                                            <span id="battery_span" class="symbols"> &#xe19c; </span>
                                            <p id="battery_p">Battery</p>
                                        </div>
                                    </div>

                                    <div class="main_data_window_device_state">
                                        <div class="main_data_window_device_status" title="Current interface connection">
                                            <span id="interface_span" class="symbols"> &#xe30a; </span>
                                            <p id="interface_p">Interface</p>
                                        </div>

                                        <div class="main_data_window_device_status" title="Current TCP connection">
                                            <span id="tcp_span" class="symbols"> &#xe307; </span>
                                            <p id="tcp_p">Remote</p>
                                        </div>
                                    </div>

                                    <div class="main_data_window_item">
                                        <p>IP:</p>
                                        <span title="Device IP" id="ip">0.0.0.0</span>
                                    </div>
                                    
                                    <div class="main_data_window_item" title="Machine monitored">
                                        <p>Machine:</p>
                                        <span id="machine">-</span>
                                    </div>

                                    <div class="main_data_window_item" title="Worker in machine">
                                        <p>Worker:</p>
                                        <span id="worker">-</span>
                                    </div>

                                    <div class="main_data_window_item" title="Order loaded">
                                        <p>Order:</p>
                                        <span id="order">-</span>
                                    </div>

                                    <div class="main_data_window_item" title="Product in production">
                                        <p>Product:</p>
                                        <span id="product">-</span>
                                    </div>

                                    <div class="main_data_window_item" title="Group in production">
                                        <p>Group:</p>
                                        <span id="group">-</span>
                                    </div>

                                    <div class="main_data_window_item" title="Client in production">
                                        <p>Client:</p>
                                        <span id="client">-</span>
                                    </div>

                                </div>
                            </div>

                            <div class="main_data_window_dis" id="dis_win">
                                <div class="main_data_window_title">
                                    <p>Disponibility</p>
                                </div>

                                <div class="main_data_window_data">

                                    <div class="main_data_window_item" title="Time monitored">
                                        <p>Monitoring Time:</p>
                                        <span id="monitoring_time">--:--:--</span>
                                    </div>
                                    
                                    <div class="main_data_window_item" title="Current machine state">
                                        <p>Live State:</p>
                                        <span id="state">D-- -</span>
                                    </div>

                                    <div class="main_data_window_item" title="Last state change time">
                                        <p>Last Change at:</p>
                                        <span id="event">--:--:--</span>
                                    </div>
                                    
                                    <div class="main_data_window_item" title="Time at monitoring started or finished">
                                        <p id="start_cease_p">Started at:</p>
                                        <span id="start_cease">--:--:--</span>
                                    </div>

                                    <div class="main_data_window_item" title="List of reliefs">
                                        <p>Reliefs:</p>
                                        <span id="reliefs">-</span>
                                    </div>

                                    <div id="window_statecounters" class="main_data_window_statecounters">

                                        <div id="codes_code" class="main_data_window_statecounters_column">
                                        </div>
                        
                                        <div id="codes_time" class="main_data_window_statecounters_column">
                                        </div>
                        
                                        <div id="codes_proportion" class="main_data_window_statecounters_column">
                                        </div>
                        
                                        <div id="codes_name" class="main_data_window_statecounters_column">
                                        </div>
                        
                                    </div>

                                </div>
                            </div>

                            <div class="main_data_window_per" id="per_win">
                                <div class="main_data_window_title">
                                    <p>Performance</p>
                                </div>

                                <div class="main_data_window_data">

                                    <div class="main_data_window_item" title="Standard cycles per hour">
                                        <p>Standard Cycle:</p>
                                        <span id="standard">0 C/Hr</span>
                                    </div>

                                    <div class="main_data_window_item" title="Measured cycles per hour">
                                        <p>Measured Cycle:</p>
                                        <span id="measured">0 C/Hr</span>
                                    </div>

                                    <div class="main_data_window_graph" id="msr_graph">
                                    </div>

                                    <div class="main_data_window_item" title="Units produced per cycle">
                                        <p>Cavities:</p>
                                        <span id="cavities">0 U/C</span>
                                    </div>

                                    <div class="main_data_window_item" title="Units produced">
                                        <p>Units Produced:</p>
                                        <span id="produced">0 U</span>
                                    </div>

                                    <div class="main_data_window_item" title="Units to produce by time producing">
                                        <p>Units To Produce:</p>
                                        <span id="toproduce">0 U</span>
                                    </div>
                                    
                                    

                                </div>
                            </div>

                            <div class="main_data_window_qua" id="qua_win">
                                <div class="main_data_window_title">
                                    <p>Quality</p>
                                </div>

                                <div class="main_data_window_data">

                                    <div class="main_data_window_item" title="Units accepted">
                                        <p>Units Accepted:</p>
                                        <span id="accepted">0 U</span>
                                    </div>

                                    <div class="main_data_window_item" title="Units Reworked">
                                        <p>Units Reworked:</p>
                                        <span id="reworked">0 U</span>
                                    </div>

                                    <div class="main_data_window_item" title="Units defective">
                                        <p>Units Defective:</p>
                                        <span id="defective">0 U</span>
                                    </div>

                                    <div class="main_data_window_item" title="Units contaminated">
                                        <p>Units Contaminated:</p>
                                        <span id="contaminated">0 U</span>
                                    </div>

                                    <div class="main_data_window_item" title="Units due machine adjustment">
                                        <p>Units due Adjust:</p>
                                        <span id="adjust">0 U</span>
                                    </div>

                                    <div class="main_data_window_production">

                                        <div id="production_time" class="main_data_window_production_column">
                                            <p>Time</p>
                                            <p>--:--:--</p>
                                        </div>

                                        <div id="production_worker" class="main_data_window_production_column">
                                            <p>Worker</p>
                                            <p>-</p>
                                        </div>

                                        <div id="production_produced" class="main_data_window_production_column">
                                            <p>Produced</p>
                                            <p>0</p>
                                        </div>

                                        <div id="production_accepted" class="main_data_window_production_column">
                                            <p>Accepted</p>
                                            <p>0</p>
                                        </div>

                                        <div id="production_reworked" class="main_data_window_production_column">
                                            <p>Reworked</p>
                                            <p>0</p>
                                        </div>

                                        <div id="production_defective" class="main_data_window_production_column">
                                            <p>Defective</p>
                                            <p>0</p>
                                        </div>

                                        <div id="production_contaminated" class="main_data_window_production_column">
                                            <p>Contaminated</p>
                                            <p>0</p>
                                        </div>

                                        <div id="production_adjust" class="main_data_window_production_column">
                                            <p>Adjust</p>
                                            <p>0</p>
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="main_data_inputs" title="Current inputs state">
                        <span class="symbols" id="input_0"> &#xe837; </span>
                        <span class="symbols" id="input_1"> &#xe837; </span>
                        <span class="symbols" id="input_2"> &#xe837; </span>
                        <span class="symbols" id="input_3"> &#xe837; </span>
                        <span class="symbols" id="input_4"> &#xe837; </span>
                        <span class="symbols" id="input_5"> &#xe837; </span>
                    </div>

                    <div class="main_data_complements">

                        <ul class="main_data_complements_nav">
                            <li title="Events list" class="main_data_complements_option main_data_complements_option-active" id="events_nav">Events</li>
                            <li title="States list" class="main_data_complements_option" id="states_nav">States</li>
                        </ul>

                        <div class="main_data_complements_main">

                            <div class="main_data_events_container main_data_complement-active" id="events_win">
                                <div id="events_time" class="main_data_events_container_column">
                                </div>
    
                                <div id="events_event" class="main_data_events_container_column">
                                </div>
                            </div>

                            <div class="main_data_states_container" id="states_win">
                                <div id="states_time" class="main_data_states_container_column">
                                </div>

                                <div id="states_worker" class="main_data_states_container_column">
                                </div>
    
                                <div id="states_state" class="main_data_states_container_column">
                                </div>

                                <div id="states_name" class="main_data_states_container_column">
                                </div>
                            </div>

                        </div>

                    </div>

                </nav>

                <p class="main_data_hidden">Device Information</p>
            </div>

        </main>

        <footer>
            <p>SERVER</p>
        </footer>

        <script src="/Static/jquery.js"></script>
        <script src="/Static/chart.js"></script>
        <script src="/Static/template.js"></script>
        <script src="/Static/home/script.js"></script>
		
	</body>

</html>