({
    doInit: function(component) {
        var folders = [{'Id': 1 , 'Name' : 'one'}
                       ,{'Id': 2 , 'Name' : 'dos'}
                       ,{'Id': 3 , 'Name' : 'tres'}
                       ,{'Id': 4 , 'Name' : 'cuatro'}
                       ];
        component.set("v.folders", folders);
    },
initValues : function(component, event, helper) { 
    //window.localStorage.setItem('myCat', 'Tom'); 
    var myCat =  component.get('v.myCat');
    console.log("On load my cat's name is " + myCat);
    // default is Jerry
    if ('Jerry' === myCat) {
        console.log("My cat's name is the default name so let's change it ")
        component.set('v.myCat', 'Felix');
        myCat =  component.get('v.myCat');
        console.log("My cat's new name is " + myCat);    
    }
},
    getValFromStorage : function (component, event, helper) {
        console.log("Get my cat's name from local storage")
        var myCat = window.localStorge.getItem('myCat');
        component.set('v.myCat', myCat);
        
    }
 
})