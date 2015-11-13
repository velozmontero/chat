
$(document).ready(function(){
    
    var myDataRef = new Firebase('https://burning-torch-3754.firebaseio.com/');
    
    var msgEntered = 'has entered the chat';
    var msgLeft = 'has left the chat';
    
    var messagesDiv= document.getElementById("messagesDiv");
    
    
    $('#nameInput').focus();
    
    $(window).on("blur focus", function(e) {
        var prevType = $(this).data("prevType"); // getting identifier to check by
        if (prevType != e.type) {   //  reduce double fire issues by checking identifier
            switch (e.type) {
                case "blur":

                    $('#messagesDiv').bind('DOMNodeInserted',function(){
                        console.log("window inactive");
                        salert.currentTime=0;
                        salert.play();
                    }); 

                    break;

                case "focus":
                    
                    $('#messagesDiv').unbind('DOMNodeInserted');
                        
                    console.log("window active");

                    break;
            }
        }
        $(this).data("prevType", e.type); // reset identifier
    });                    
  
    
    //----- Generate Random color not in use yet -------/>
    /*function generateColor(txt){
        var a = Math.floor((256-229)*Math.random()) + 230;
        var b = Math.floor((256-229)*Math.random()) + 230;
        var c = Math.floor((256-229)*Math.random()) + 230;

        color = "rgb(" + a + "," + b + "," + c + ")";
    };*/


    $('#messageInput').keypress(function (e) {
      if (e.keyCode == 13) {
        
        var salert= document.getElementById("salert");  
         
        var name = $('#nameInput').val();
        var text = $('#messageInput').val();
          
        if (!text) {
            $('#messageInput').addClass('alert');
        }
        else{
            myDataRef.push({name: name, text: text});
            $('#messageInput').removeClass('y onY').val('').change();
            $('#messageInput').val('');
        }  
      }
    });

    myDataRef.on('child_added', function(snapshot) {
      var message = snapshot.val();
      displayChatMessage(message.name, message.text);
    });

    function displayChatMessage(name, text) {    
      $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
      $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
    };

    $('#nameInput').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            var name = $('#nameInput').val();
            var text = $('#messageInput').val();

            if (!name) {
                $('#nameInput').addClass('alert');
            }
            else{
                $('#access').addClass('hidden');
                $('#granted').removeClass('hidden'); 
                myDataRef.push({name: name, text: msgEntered, connected: true});
                $('#messageInput').focus();
            }
        }
    });

    function tog(v){return v?'addClass':'removeClass';} 
        $(document).on('input', '.enter', function(){

            $('#nameInput').removeClass('alert');

            $(this)[tog(this.value)]('x');
        }).on('mousemove', '.x', function( e ){
            $(this)[tog(this.offsetWidth-60 < e.clientX-this.getBoundingClientRect().left)]('onX');
        }).on('touchstart click', '.onX', function( ev ){
            var name = $('#nameInput').val();

            ev.preventDefault();
            
            $('#access').addClass('hidden');
            $('#granted').removeClass('hidden');
            $('#messageInput').focus();
            myDataRef.push({name: name, text: msgEntered, connected: true});
    });
    
    function tog2(v){return v?'addClass':'removeClass';} 
        $(document).on('input', '.send', function(){

            $('#messageInput').removeClass('alert');

            $(this)[tog2(this.value)]('y');
        }).on('mousemove', '.y', function( e ){
            $(this)[tog2(this.offsetWidth-60 < e.clientX-this.getBoundingClientRect().left)]('onY');
        }).on('touchstart click', '.onY', function( ev ){
            var name = $('#nameInput').val();
            var text = $('#messageInput').val();
            
            ev.preventDefault();
            $(this).removeClass('y onY').val('').change();
            
            myDataRef.push({name: name, text: text});
            $('#messageInput').val('');
    });
    
    $( window ).unload(function() {
        var name = $('#nameInput').val();
        
        var ref = new Firebase('https://burning-torch-3754.firebaseio.com/');
        ref.once("value", function(snapshot) {
            
            snapshot.forEach(function(childSnapshot) {
                
                // key will be "fred" the first time and "barney" the second time
                var key = childSnapshot.key();
                console.log(key);    
                // childData will be the actual contents of the child
                var childData = childSnapshot.val();
                console.log(childData);
       
            });
        });    
          
        return myDataRef.push({name: name, text: msgLeft});
    });
    
});

