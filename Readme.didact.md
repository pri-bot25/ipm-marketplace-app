<html>
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
    color:#fff;
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

<body style="font-family: 'IBM Plex Sans', sans-serif;background-color:#1a1a1a;">
<div style="font-family: 'IBM Plex Sans', sans-serif;background-color:#1a1a1a;">
<h2 class="title is-3 ">Business Cases for Partner Marketplace</h2>

<br/><br/>

<h3>Business Value </h3>

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
</p><br/>

<h3>Sample Application</h3>
<br/>
<p>Try out the Sample Application</p>

<ol>

<li>Before you configure and launch the application, it is necessary to retrieve the API credentials from API Hub by following the steps:<br>
<ol type='a'>
<li>Login to <a title= "IBM API Hub" href="https://developer.sl.bluecloud.ibm.com/sso/displayname?lang=en_US&d=https%3A%2F%2Fdeveloper.sl.bluecloud.ibm.com%2Fprofile%2Fmyapis%2F">IBM API Hub</a> using your IBM ID.</li><br>

<li>In  <u><i><b> API Subscriptions</b></i></u>  section launch  <u><i><b> IBM Marketplace APIs </b></i></u> , If you are not able to see <u><i><b> IBM Marketplace APIs </b></i></u><br>then click on <u><i><b> Visit IBM API Hub </b></i></u> and search for IBM Marketplace APIs and subscribe.</li><br>
<li>After launching <u><i><b> IBM Marketplace APIs </b></i></u> , you will see <u><i><b> Key management </b></i></u> section where your existing API Key's will be listed.</li><br>

<li>If no key's listed then use <u><i><b> Generate API Key </b></i></u> button and create new key.</li><br>

<li>Copy the <u><i><b> Client ID </b></i></u> and <u><i><b> Client secret </b></i></u> by expanding the key from the list.</li>
</ol><br>

<li> First you must click the "Start Terminal" button in order to start a terminal which will execute the next following steps.<br><br>
Please make sure that you must <b>not close the Terminal</b> after clicking the "Start Terminal" button, as you will not be able to configure the Application in the next step.</li><br>

<a class="button is-dark is-medium" title="Start Terminal" href="didact://?commandId=terminal-for-nodejs-container:new">Start Terminal</a><br><br>

<li>Clone the new sample app by clicking the "Clone the Repo" button. </li><br>

<a class="button is-dark is-medium" title="Clone the repositry" href='didact://?commandId=vscode.didact.sendNamedTerminalAString&text=nodejs%20terminal%201$$cd%20%2Fprojects%20%26%26%20git%20clone%20-b%20playground%20https%3A%2F%2Fgithub.ibm.com%2Fdigital-marketplace%2Fipm-pivot.git' >Clone the Repo</a>
<br><br>

<li>Then you must configure the Application by clicking "Configure the Application" button, which will create a <b>.env</b> file to enter your API credentials i.e Client_ID and Client_Secret.</li><br/>

<a class="button is-dark is-medium" title="Configure the Appilication" href="didact://?commandId=vscode.didact.sendNamedTerminalAString&text=nodejs%20terminal%201$$cd%20ipm-pivot%20%26%26%20cp%20%20.env.stage%20.env%20%26%26%20npm%20install%20%26%26%20npm%20install%20--save-dev%20nodemon&completion=The%20.env%20file%20is%20created">Configure the Application</a><br><br>

<li>Now, you must open the file by clicking the  "Open the File" button in order to enter the API Credentials in the <b>.env</b> file.</li>
<br>

<a class="button is-dark is-medium" title="Open the File" href="didact://?commandId=file-search.openFile&projectFilePath=ipm-pivot/.env">Open the File</a>
<br><br>

<li>You must verify the required configurations before launching the sample application.</li><br><br>

| Requirement (Click to Verify)  | Status |
| :--- | :--- |
| [Check if Node exists on CLI](didact://?commandId=vscode.didact.cliCommandSuccessful&text=node-status$$npm%20--version%20%26%26%20node%20--version "Ensure that Node is available at the command line"){.didact} | *Status: unknown*{#node-status} | 
| [Check if .env exists on CLI](didact://?commandId=vscode.didact.cliCommandSuccessful&text=file-status$$%5B%20-f%20%2Fprojects%2Fipm-pivot%2F.env%20%5D%20%26%26%20echo%20%24%3F "Ensure that .env file is available in the folder"){.didact}| *Status: unknown*{#file-status} |
| [Check if the credentials are valid and exists on CLI](didact://?commandId=vscode.didact.cliCommandSuccessful&text=cred-status$$grep%20-c%20%27CLIENT_ID%3D%5Ba-zA-z0-9%5D%27%20%2Fprojects%2Fipm-pivot%2F.env%20%26%26%20grep%20-c%20%27CLIENT_SECRET%3D%5Ba-zA-z0-9%5D%27%20%2Fprojects%2Fipm-pivot%2F.env%20%26%26%20echo%20%24%3F "Ensure that the credentials do exist."){.didact}| *Status: unknown*{#cred-status} |


<br>

<a class="button is-dark is-medium" href='didact://?commandId=vscode.didact.validateAllRequirements' title='Validate all requirements!'>Validate all Requirements at Once!</a>
<br><br>

<li> Once you have configured the Application and completed entering the API credentials, then launch the application by clicking the "Launch the App" button.</li><br/>
<a class="button is-dark is-medium" title="Launch the Application" href="didact://?commandId=vscode.didact.sendNamedTerminalAString&text=nodejs%20terminal%201$$ps -ef| grep 'npm\|./bin/www' | awk 'NR==1 || NR==2 || NR==3 || NR==4{print $2}'| xargs kill -9;npm%20run%20start-dev&completion=The%20application%20has%20been%20launched.">Launch the App</a><br><br>

<p>You will see a dialog box saying " The application has been launched." </p><br>


<li>Now, You can Stop the Application by clicking the "Stop the App" button. If you want to Launch the app again you can click "Launch the App" button.</li><br>
<a class="button is-dark is-medium" title="Stop the app" href="didact://?commandId=vscode.didact.sendNamedTerminalCtrlC&text=nodejs%20terminal%201$$npm%20run%20start-dev" >Stop the App</a>
<br><br>

</ol>
<br/>



<ul>
<li>
<a class="user_exp" title="IBM Configuration for Partner Marketplace Integration" href="didact://?commandId=vscode.didact.startDidact&projectFilePath=/ipm-pivot/Readme2.didact.md">IBM Configuration for Partner Marketplace Integration
<span class="icon">
    <i class="fas fa-arrow-right is-large"></i>
  </span>
</a>
</li>
</ul>


<br><br><br>



</div>
</body>
</html>


