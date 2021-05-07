<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
html,div,body{
    background-color:#1a1a1a;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size:20px;
}
.content h2,h3,h4
{
    font-family: 'IBM Plex Sans', sans-serif;
    background-color:#1a1a1a;
}
.content h2,p{
    color:#fff;
    font-family: 'IBM Plex Sans', sans-serif;
}
.content p{
  font-family: 'IBM Plex Sans', sans-serif;  
  font-size:20px;
  color: #fff;
}
pre{
    background-color:#d9dbde;
    color:#000;
    font-family: 'IBM Plex Sans', sans-serif;
    font:15px;
}
.content h4{
    font-family: 'IBM Plex Sans', sans-serif;
    background-color:#1a1a1a;
    color:#fff;
    font-size:28px;
}
.content h6{
    font-family: 'IBM Plex Sans', sans-serif;
    background-color:#1a1a1a;
    color:#fff;
}
.content h3{
    font-family: 'IBM Plex Sans', sans-serif;
    color: #fff;
    background-color:#1a1a1a;
}
ul, ol,b{ 
    font-family: 'IBM Plex Sans', sans-serif;
    color: #fff;
}
#ul1{
  font-family: 'IBM Plex Sans', sans-serif;
    color: #fff;
    font-size:20px;
}
.button.is-dark.is-medium {
  font-family: 'IBM Plex Sans', sans-serif;
  background-color: #0f62fe;
  border-color: #0f62fe;
  color: #fff;
}
.button.is-dark.is-medium:hover {
  font-family: 'IBM Plex Sans', sans-serif;
  background-color: #0f62fe;
  border-color: #0f62fe;
  color: #fff;
}
.title.is-3{
  font-family: 'IBM Plex Sans', sans-serif;
  color:#fff;
}
.subtitle.is-4{
    font-family: 'IBM Plex Sans', sans-serif;
    color:#fff;
}
ol,ul,li{
  font-size:20px;
  color: #fff;
}
.tag.is-light.is-normal{
    background-color: #79a4f2;
    font-family: 'IBM Plex Mono', sans-serif;
    radius: 3px;
}
.user_exp{
  font-family: 'IBM Plex Sans', sans-serif;
  font-size:20px;
  font-weight:bold;
  color:#0f62fe;
}
</style>
</head>

<body style="font-family: 'IBM Plex Sans', sans-serif;background-color:#1a1a1a;">
<div style="font-family: 'IBM Plex Sans', sans-serif;background-color:#1a1a1a;">
<h2 class="title is-3 ">Business Cases for Partner Marketplace<br></h2>

<h3>Business Value <br> </h3>

<p>The proposed solution plans to address two problems faced with partner marketplaces</p>
<ul id="ul1">
<li>Often offerings have complex configuration rules related to add-ons and a maintenance overhead for partners to code and introduce in catalog.</li>
<li>Resellers may not know the details required to provision the service and would like to delegate the customer contact. This is currently not feasible.</li>
</ul>

<p>Business value to IBM's partners<br/>
<ul>
<li>Decouple  from implementing  product configuration  rules</li>
<li>Workflow to capture product  provisioning  details,  by end  customer or reseller</li>
<li>Expedited  product  introduction  and launch</li>
</ul>
</p>

<h3>IPM Marketplace Application</h3>

<p>Before going ahead with launching the marketplace application, it is necessary to utilise the <em><b> staging API credentials </b></em> that will be provided in the onboarding email from <em><b>IBM</b></em> since this is a staging environment which will provide the details about the fundamentals i.e. the product configurations and the interactions of Marketplace APIs.</p> 

<p>Hence, it is advised to <em><b> not to utilise the production credentials</b> </em> in the staging environment. </p>

<p>Try out the application</p>
<ol>
<li> After obtaining staging API credentials, get the application code by clicking the "Clone the Repositry" button. </li><br>

<a class="button is-dark is-medium" title="Clone the repositry" href='didact://?commandId=vscode.didact.sendNamedTerminalAString&text=IPM-Marketplace-App$$git%20clone%20-b%20playground%20https%3A%2F%2Fgithub.com%2FIBM%2Fipm-marketplace-app.git%20%26%26%20cd%20${CHE_PROJECTS_ROOT}/ipm-marketplace-app%20%26%26%20touch%20.env%20%26%26%20printf%20%22%23%20IBM%20Marketplace%20API%20CLIENT_ID%5CnCLIENT_ID%3D%5Cn%5Cn%23%20IBM%20Marketplace%20CLIENT_SECRET%5CnCLIENT_SECRET%3D%22%20%3E%20.env' >Clone the Repositry</a>
<br><br>

<li>Next click the "Configure Application" button in order to enter the API Credentials i.e. Client_ID and Client_Secret in the <b>.env</b> file.</li>
<br>

<a class="button is-dark is-medium" title="Configure Application" href="didact://?commandId=file-search.openFile&projectFilePath=ipm-marketplace-app/.env">Configure Application</a>
<br><br>

<li>Now click on the "Build Application" button.</li><br/>

<a class="button is-dark is-medium" title="Build Appilication" href="didact://?commandId=vscode.didact.sendNamedTerminalAString&text=IPM-Marketplace-App$$cd%20${CHE_PROJECTS_ROOT}/ipm-marketplace-app%20%26%26%20npm%20install&completion=The%20.env%20file%20is%20created">Build Application</a><br><br>


<li>You must verify the required configurations before launching the application by clicking the "Validate all Requirements" button.</li><br><br>

| Requirement (Click to Verify)  | Status |
| :--- | :--- |
| [Check if Node exists on CLI](didact://?commandId=vscode.didact.cliCommandSuccessful&text=node-status$$npm%20--version%20%26%26%20node%20--version "Ensure that Node is available at the command line"){.didact} | *Status: unknown*{#node-status} | 
| [Check if .env exists on CLI](didact://?commandId=vscode.didact.cliCommandSuccessful&text=file-status$$%5B%20-f%20%2Fprojects%2Fipm-marketplace-app%2F.env%20%5D%20%26%26%20echo%20%24%3F "Ensure that .env file is available in the folder"){.didact}| *Status: unknown*{#file-status} |
| [Check if the credentials are valid and exists on CLI](didact://?commandId=vscode.didact.cliCommandSuccessful&text=cred-status$$grep%20-c%20%27CLIENT_ID%3D%5Ba-zA-z0-9%5D%27%20%2Fprojects%2Fipm-marketplace-app%2F.env%20%26%26%20grep%20-c%20%27CLIENT_SECRET%3D%5Ba-zA-z0-9%5D%27%20%2Fprojects%2Fipm-marketplace-app%2F.env%20%26%26%20echo%20%24%3F "Ensure that the credentials do exist."){.didact}| *Status: unknown*{#cred-status} |


<br>

<a class="button is-dark is-medium" href='didact://?commandId=vscode.didact.validateAllRequirements' title='Validate all requirements'>Validate all Requirements</a>
<br><br>

<li> Once you have configured the Application with the API credentials in the <b>.env</b> file, then launch the application by clicking the "Launch Application" button.</li><br/>
<a class="button is-dark is-medium" title="Launch Application" href="didact://?commandId=vscode.didact.sendNamedTerminalAString&text=IPM-Marketplace-App$$cd%20${CHE_PROJECTS_ROOT}/ipm-marketplace-app%20%26%26%20ps -ef| grep 'npm\|./bin/www' | awk 'NR==1 || NR==2'| xargs kill -9;npm%20run%20start&completion=The%20application%20has%20been%20launched.">Launch Application</a><br><br>

<p>You will see a dialogue box with a message <b>"A process is now listening on port 3000. External URL is https://container-url.com"</b>. <br><br> Click the "Open Link" button. You will see your application in the Preview Tab.</p>
<br>
</ol>


<ol>
<h4>Customize Your Application</h4>

<p>You have successfully launched the application. Now, you can now customize your application by making changes in the given application code and rebuild the application. In order to view your customized application, it is required to follow the given steps below.</p>

<ol>

<li>Make the code changes in the desired file(s) of the given application code which is present in the Explorer.</li>
<br>

<li>Next stop the Application by clicking the "Stop Application" button.</li><br>
<a class="button is-dark is-medium" title="Stop Application" href="didact://?commandId=vscode.didact.sendNamedTerminalCtrlC&text=IPM-Marketplace-App$$cd%20${CHE_PROJECTS_ROOT}/ipm-marketplace-app%20%26%26%20npm%20run%20start-dev" >Stop Application</a>
<br>
<br>

<li>Now click the "Rebuild & Launch Application" button.</li><br>
<a class="button is-dark is-medium" title="Rebuild & Launch Application" href="didact://?commandId=vscode.didact.sendNamedTerminalAString&text=IPM-Marketplace-App$$cd%20${CHE_PROJECTS_ROOT}/ipm-marketplace-app%20%26%26%20ps -ef| grep 'npm\|./bin/www' | awk 'NR==1 || NR==2'| xargs kill -9;npm%20run%20build-clean%20%26%26%20npm%20run%20build-client%20%26%26%20npm%20run%20start" >Rebuild & Launch Application</a>
<br><br>

<p>You will see a dialogue box with a message <b>"A process is now listening on port 3000. External URL is https://container-url.com"</b>. <br><br> Click the "Open Link" button. This time you will need to refresh the url in the Preview tab to see your application with the code changes.</p>
<br>
</ol>
</ol>

<ul>

<p>To understand more details about the interactions of APIs within the appliction, click <a class="user_exp" title="IBM Configuration for Partner Marketplace Integration" href="didact://?commandId=vscode.didact.startDidact&projectFilePath=/ipm-marketplace-app/Readme2.didact.md">IBM Configuration for Partner Marketplace Integration</a>.</p>
<br>

<p>If you have some interesting ideas and you would like to contribute, please check out the project on <a class="user_exp" href="https://github.com/IBM/ipm-marketplace-app">IPM Marketplace App Github</a>, where new ideas are welcomed and feel free to <a class="user_exp" href="https://github.com/IBM/ipm-marketplace-app/issues">submit feature requests, submit pull requests for codes, log bugs and so on</a>.</p>

</ul>
<br><br><br>



</div>
</body>
</html>


