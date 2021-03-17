<h1 align=center> ListHub : a shared todolist app</h1>
<h3 align=center> IONIC - CAPACITOR - ANGULAR - FIREBASE</h3>

## Basic features : 
    - Email signIn and registration
    - Email verification
    - Password recovery
    - Google signIn
    - Create/Delete a list
    - Create/Delete a task
    - searchbar for lists and tasks
    - Share lists (permissions : readonly, read and write, share)
    - List progress with animation
    - Profile page : show & update user informations
    - Settings page : enable/disable provided functionalities

## Advanced features : 
### UI :
    - Custom first launch tutorial 
    - Custom application icon
    - Custom plashScreen **(splash-screen plugin)**
    - Show toast when network status changes **(network plugin)**

### Settings :
    - Enable/disable dark mode
    - Enable/disable delete confirmation (for lists and tasks)
    - Enable/disable Haptics/Vibrations **(haptics plugin)**
    - Enable/disable text to speech **(text-to-speech plugin)**
    - Select speech speed **(text-to-speech plugin)**
    - Select speech language (supported only on web platform, english for iOS and Android)
    - Settings stored in local storage **(local storage plugin)**
	
### Profile :
    - Update user information.
    - Update user picture : remove - choose from galery - take picture **(camera plugin + action-sheet)**

### Tasks :
    - Add tasks with address ( address search bar with autocompletion)
    - Cast address to long/lat using geocoding **(mapbox package)**
    - Speak if text-to-speech enabled in settings **(text-to-speech plugin)**
    - Show address in a mapbox with a marker (if address provided in task)
    - Show user localisation if available **(geolocation plugin)**

### Others :
    - Open in-app browser **(browser plugins)**
    

## Plugins used :
### Map (https://github.com/mapbox)
    - ✅ mapbox-gl-js
    - ✅ mapbox-gl-directions
    
### Capacitor official plugins 
    - ✅ @capacitor/storage                     
    - ✅ @capacitor/splash-screen         
    -    @capacitor/local-notifications    
    -    @capacitor/share                         
    -    @capacitor/camera                      
    - ✅ @capacitor/network                     
    - ✅ @capacitor/geolocation               
    - ✅ @capacitor/browser                    
    - ✅ @capacitor/action-sheet            

### Capacitor community plugins (https://github.com/capacitor-community)
    - ✅ @capacitor-community/text-to-speech      
    - ✅ @capacitor-community/privacy-screen     
