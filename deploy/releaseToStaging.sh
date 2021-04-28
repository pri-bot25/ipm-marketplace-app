#!/bin/sh
#Install ibmcloud cli
echo beforeIf
if [ ! -f ibmcloud ]; then
echo insideIf
echo $ARTIFACTORY_API_KEY
    # Download and setup IBM Cloud CLI
    curl -H "X-JFrog-Art-Api:$ARTIFACTORY_API_KEY" -O "https://na.artifactory.swg-devops.com/artifactory/dbg-marketplace-nestor-generic-local/build/ibmcloud/IBM_Cloud_CLI_0.19.0_amd64.tar.gz"
    echo inside1
    gunzip IBM_Cloud_CLI_0.19.0_amd64.tar.gz
        echo inside2
    tar -xvf IBM_Cloud_CLI_0.19.0_amd64.tar
        echo inside3
fi
echo AfterIf
# Install IBM Cloud CLI
./Bluemix_CLI/install

# Clean up the binaries
rm -rf Bluemix_CLI
rm -f IBM_Cloud_CLI_0.19.0_amd64.tar.gz
rm -r IBM_Cloud_CLI_0.19.0_amd64.tar

# Verifying the IBMCLOUD CLI
ibmcloud help

bluemix_org=$1
bluemix_space=$2
cf_endpoint=$3
domainname=$4
primary_inst_app_name=$5
primary_inst_app_host=$6
ibmcloudTarget=https://cloud.ibm.com
temp_inst=$5-$TRAVIS_BUILD_ID
number_of_instances=1

yes|cp -r deploy/manifest.yml deploy/manifest-stage.yml
sed -i "s/  domain: mybluemix.net/  domain: $domainname/g" deploy/manifest-stage.yml
sed -i "s/  host: ipm-pivot-stage/  host: $temp_inst/g" deploy/manifest-stage.yml
sed -i "s/- name: ipm-pivot-stage/- name: $temp_inst/g" deploy/manifest-stage.yml
sed -i "s/  instances: 1/  instances: $number_of_instances/g" deploy/manifest-stage.yml


#Login using ibmcloud cli
ibmcloud config --check-version=false
ibmcloud login -a $ibmcloudTarget --apikey $IPM_PIVOT_CLOUD_API_KEY -r us-south
errorCode=$?

if [ $errorCode != 0 ]; then
        echo "ibmcloud target failed. Please check if Bluemix APIKey, Organization and Space name are correct."
        exit $errorCode
fi

ibmcloud target --cf-api $cf_endpoint -o $bluemix_org -s $bluemix_space

errorCode=$?

if [ $errorCode != 0 ]; then
        echo "ibmcloud login failed. Please check if Bluemix APIKey, Organization and Space name are correct."
        exit $errorCode
fi

# Copy all user defined env variables from primary_inst_app_name so that the same variables can be configured for temp app as well
ibmcloud cf env $primary_inst_app_name > var.txt

# Retrieve only the userdefined env variables
awk '/User-Provided:/{flag=1}/Running Environment Variable Groups:/{flag=0}flag' var.txt > env.txt

# Formatting so that upon appending to manifest-stage.yml, content is clean
sed -i '/^$/d' env.txt
sed -i -e 's/^/    /' env.txt
sed -i -e 's/    User-Provided:/  env:/g' env.txt

# Append the content to manifest file
cat env.txt >> deploy/manifest-stage.yml

# Check if an app with primary_inst_app_name name already exists.
$(ibmcloud cf apps | grep -q $primary_inst_app_name);
errorCode=$?

if [ $errorCode == 0 ]; then
        # Create a new temp app(Green) for ipm-pivot
        ibmcloud cf push -f deploy/manifest-stage.yml
        errorCode=$?
        if [ $errorCode != 0 ]; then
                echo " Command \"ibmcloud cf push -f deploy/manifest-stage.yml\" failed for the new $temp_inst app."
                exit $errorCode
        fi

        # Add a route for the temp app from current primary one.
        ibmcloud cf map-route $temp_inst $domainname -n $primary_inst_app_host
        errorCode=$?
        if [ $errorCode != 0 ]; then
                echo "Command \"ibmcloud map-route $temp_inst $domainname -n $primary_inst_app_host\" failed. Please check if both primary and temp instance are present."
                exit $errorCode
        fi
        
        # Remove route for the primary instance. So all requests for the primary app from now onwards will be made by CF router to temp app. Hence temp app will now be the new primary app.
        ibmcloud cf unmap-route $primary_inst_app_name $domainname -n $primary_inst_app_host
        errorCode=$?
        if [ $errorCode != 0 ]; then
                echo "Command \"ibmcloud cf unmap-route $primary_inst_app_name $domainname -n $primary_inst_app_host\" failed. Please check if primary instance is present."
                exit $errorCode
        fi
        
        # Remove route for the temp app since this is the new Primary app.
        ibmcloud cf unmap-route $temp_inst $domainname -n $temp_inst
        errorCode=$?
        if [ $errorCode != 0 ]; then
                echo "Command \"ibmcloud cf unmap-route $temp_inst $domainname -n $temp_inst\" failed. Please check if temp instance is present."
                exit $errorCode
        fi

        # Delete the old primary_inst_app_name since is is no longer used.
        ibmcloud cf delete $primary_inst_app_name -f
        errorCode=$?
        if [ $errorCode != 0 ]; then
                echo "Command \"ibmcloud cf delete $primary_inst_app_name -f\" failed."
                exit $errorCode
        fi

        # Rename the temp_inst to primary_inst_app_name since this is the latest primary_inst_app_name (Blue). And also helps us to use the same script in all future builds.
        ibmcloud cf rename $temp_inst $primary_inst_app_name
        errorCode=$?
        if [ $errorCode != 0 ]; then
                echo "Command \"ibmcloud cf rename $temp_inst $primary_inst_app_name\" failed."
                exit $errorCode
        fi
        echo "Blue-green deployment for ipm-pivot app successful."
else
        echo "$primary_inst_app_name is not available in space $bluemix_space of Organisation $bluemix_org in Bluemix. Hence cannot continue with blue-green deployment."        
        exit $errorCode
fi
