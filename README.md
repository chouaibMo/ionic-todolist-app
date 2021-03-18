<h1 align=center> Firetask : a shared todolist app</h1>
<h3 align=center> IONIC - CAPACITOR - ANGULAR - FIREBASE</h3>


## Summary 
- [Preview](#preview)
- [Installation](#installation)
- [Basic features](#basic)
- [Advanced features](#advanced)
    - [UI](#ui)
    - [Settings](#settings)
    - [Profile](#profile)
    - [Lists and Tasks](#lists)
    - [Others](#others)
- [Plugins used](#plugins)
    - [Mapbox](#map)
    - [Capacitor official plugins](#cap)
    - [Capacitor community plugins](#cap-com)
	
<span id="preview"></span>
## 1 - Preview
### First launch
<img src="/screenshots/login.jpg?raw=true" width="270" height="500"/> 
<img src="/screenshots/register.jpg?raw=true" width="270"/>  

### Login/Register
<img src="/screenshots/login.jpg?raw=true" width="270"/> 
<img src="/screenshots/register.jpg?raw=true" width="270"/> 
<img src="/screenshots/register.jpg?raw=true" width="270"/> 

### Lists/Tasks
<img src="/screenshots/login.jpg?raw=true" width="270"/> 
<img src="/screenshots/register.jpg?raw=true" width="270"/> 

<span id="installation"></span>
## 2 - Installation


<span id="basic"></span>
## 3 - Basic features 
    - Email signIn and registration
    - Email verification
    - Password recovery
    - Google signIn
    - Form errors handling
    - Create/Delete a list
    - Create/Delete a task
    - searchbar for lists and tasks
    - Share lists (permissions : readonly, read and write, share)
    - List progress with animation
    - Profile page : show & update user informations
    - Settings page : enable/disable provided functionalities

<span id="advanced"></span>
## 4 - Advanced features 
<span id="ui"></span>
### UI :
    - Erogonomic UX/UI design
    - Custom first launch tutorial 
    - Custom application icon
    - Custom plashScreen **(splash-screen plugin)**
    - Show toast when network status changes **(network plugin)**

<span id="settings"></span>
### Settings :
    - Enable/disable dark mode
    - Enable/disable delete confirmation (for lists and tasks)
    - Enable/disable Haptics/Vibrations **(haptics plugin)**
    - Enable/disable text to speech **(text-to-speech plugin)**
    - Select speech speed **(text-to-speech plugin)**
    - Select speech language (supported only on web platform, english for iOS and Android)
    - Settings stored in local storage **(local storage plugin)**
	
<span id="profile"></span>	
### Profile :
    - Update user information.
    - Update user picture : remove - choose from galery - take picture **(camera plugin + action-sheet)**

<span id="lists"></span>
### Lists and Tasks :
    - Offline mode (create/delete lists or tasks)
    - Add tasks with address ( address search bar with autocompletion)
    - Cast address to long/lat using geocoding **(mapbox package)**
    - Speak if text-to-speech enabled in settings **(text-to-speech plugin)**
    - Show address in a mapbox with a marker (if address provided in task)
    - Show user localisation if available **(geolocation plugin)**

<span id="others"></span>
### Others :
    - Open in-app browser **(browser plugins)**

<span id="plugins"></span>
## 5 - Plugins used :
<span id="map"></span>
### Mapbox ([mapbox](https://github.com/mapbox))
    - ✅ mapbox-gl-js
    - ✅ mapbox-gl-directions
    
<span id="cap"></span>    
### Capacitor official plugins ([capacitor-plugins](https://github.com/capacitor-community))
    - ✅ @capacitor/storage                     
    - ✅ @capacitor/splash-screen         
    -    @capacitor/local-notifications    
    -    @capacitor/share                         
    -    @capacitor/camera                      
    - ✅ @capacitor/network                     
    - ✅ @capacitor/geolocation               
    - ✅ @capacitor/browser                    
    - ✅ @capacitor/action-sheet            


<span id="cap-com"></span>
### Capacitor community plugins ([capacitor-community](https://github.com/capacitor-community))
    - ✅ @capacitor-community/text-to-speech      
    - ✅ @capacitor-community/privacy-screen     
