Symfony Standard Edition
========================

Welcome to the Symfony Standard Edition - a fully-functional Symfony2
application that you can use as the skeleton for your new applications.


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