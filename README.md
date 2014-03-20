phonegap_rfduino_proto
=====================

First attemps to compile a Phonegap framework with a RFduino plugin, on a MacOs

I had already a working XCode
I follow phonegap instructions , and download the com.megster.cordova.rfduino plugin
Then, this the steps i found working for my goal :

phonegap create capteurs5
cd capteurs5
chmod -R 777 .

Then i edit  www/config.xml and change the name property : <name>HelloWorld</name> in <name>OpenRad5</name> 

phonegap run ios
chmod -R 777 .

this order create the platforms directory, platforms/ios in my case

then i open platforms/ios/OpenRad5.xcodeproj with Xcode

then i quit Xcode and add the plugin :

chmod -R 777 .
phonegap plugin add com.megster.cordova.rfduino

then go again i Xcode and compile with the plugin code this time
then i download the cordova-plugin-rfduino-master.zip file , uncompres and go the examples/temparature/www directory
then i copy all the files except for the config.xml and copy them in the  platforms/ios/www directory

and it is working for me, i compile and launch an app on my iphone5 (iOS6), which read a RFduino sensor : 
i have a list of detected RFduino devices, i choose mine, i have a continuous reading and can send the data to a server
