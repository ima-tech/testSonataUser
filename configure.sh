#!/bin/bash

needToBeRoot=false
php="php"
phpMac="/usr/local/php5-5.4.16-20130615-025727/bin/php"

if [ "$1" = "-prod" ] ; then
   argument="prod"
elif [ "$1" = "-initialSetup" ] ; then
   argument="initialSetup"
   needToBeRoot=true;
elif [ "$1" = "-clear" ] ; then
    argument="clear"
    needToBeRoot=true;
elif [ "$1" = "-updateDB" ] ; then
    argument="updateDatabase"
elif [ "$1" = "-updateDBForce" ] ; then
    argument="updateDatabaseForce"
elif [ "$1" = "-setRights" ] ; then
    argument="setRights"
    needToBeRoot=true;
elif [ "$1" = "-runTests" ] ; then
    argument="runTests"
    if [ "$2" = "" ] ; then
        echo "You must specify a namespace"
        exit 1
    fi
elif [ "$1" = "-generateEntities" ] ; then
    argument="generateEntities"
    if [ "$2" = "" ] ; then
        echo "You must specify a namespace"
        exit 1
    fi
elif [ "$1" = "-createDefaultDirectories" ] ; then
    argument="createDefaultDirectories"
else
    echo "You must specify at least one argument"
    exit 1
fi

if [ "$2" = "-mac" ] ; then
    php=$phpMac
fi

if [ "$3" = "-mac" ] ; then
    php=$phpMac
fi

if [ "$needToBeRoot" = true ] ; then
    if [ "$(id -u)" != "0" ]; then
        echo "Sorry, you are not root."
        exit 1
    fi
fi

if [ "$argument" = "clear" ] ; then
    echo "Clearing the cache"
    rm -Rf app/cache/*
elif [ "$argument" = "prod" ] ; then
    echo "Putting into production mode"
    eval $php app/console doctrine:schema:update --force
    eval $php app/console cache:clear --env=prod --no-debug
    eval $php app/console assets:install web
    eval $php app/console assetic:dump web
    rm -Rf app/cache/*
elif [ "$argument" = "updateDatabase" ] ; then
    echo "Updating database"
    eval $php app/console doctrine:schema:update
elif [ "$argument" = "initialSetup" ] ; then
    echo "Initial setup"
    eval $php composer.phar self-update

    eval $php composer.phar install

    eval mkdir web/uploads/media

        rm -Rf app/cache/*

    if [ "$2" = "-mac" ] ; then
        chmod +a "www allow delete,write,append,file_inherit,directory_inherit" app/cache app/logs
        chmod +a "`whoami` allow delete,write,append,file_inherit,directory_inherit" app/cache app/logs
    else
        chmod -R 777 app/cache
        chmod -R 777 app/logs
    fi
    chmod -R 777 web/uploads

elif [ "$argument" = "updateDatabaseForce" ] ; then
    echo "Updating database using --force option"
    eval $php app/console doctrine:schema:update --force
elif [ "$argument" = "generateEntities" ] ; then
    echo "Generating entities for namespace: $2"
    eval $php app/console doctrine:generate:entities $2
elif [ "$argument" = "runTests" ] ; then
    eval phpunit -c app $2
elif [ "$argument" = "createDirectories" ] ; then
    eval mkdir web/uploads/media
elif [ "$argument" = "setRights" ] ; then
    rm -Rf app/cache/*

    if [ "$2" = "-mac" ] ; then
        chmod +a "www allow delete,write,append,file_inherit,directory_inherit" app/cache app/logs
        chmod +a "`whoami` allow delete,write,append,file_inherit,directory_inherit" app/cache app/logs
    else
        chmod -R 777 app/cache
        chmod -R 777 app/logs
    fi
    chmod -R 777 web/uploads
fi

