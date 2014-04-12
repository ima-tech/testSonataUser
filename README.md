Sonata Testing overloading Registration
========================

This directory is to test and figure out why I can't overwrite sonata registration form to create a user with more fields


1) Get the vendors
----------------------------------
First, using composer, launch the following command:

    composer.phar install


This will install all the vendors.

2) Create a database
----
Now, you have to create a database, I named it test3 with user and passwords the same. If you change one of the names, change it also in the parameters file located in app/config/parameters.yml

3) Update the doctrine schema
----
Launch the command:

    php app/console doctrine:schema:update --force


4)
----

Access the website at app_dev.php/register and see the problem when trying to register a user