
$(document).ready(function(){
  
    resizeChat();
  
    $( window ).resize(function(){
        resizeChat();  
    });
  
    function resizeChat() {
        var windowHeight= window.innerHeight;
      
        var mInput= $('#myinputmsg').height();
        
        var nav= $('#nav').height();
        
        var smilyFace= $('#smily-face').height();
  
        var mHeight= windowHeight-mInput-nav;
            
        $('#message-holder').css('height', mHeight);
        
        $('#sidebar-wrapper').css('height', mHeight);
    }
    
    $(".slide-in").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $(this).toggleClass("rotate-180");
    });
    
    
    
    var num1= Math.floor (Math.random()*9 + 1).toString();
    var num2= Math.floor (Math.random()*9 + 1).toString();
    var num3= Math.floor (Math.random()*9 + 1).toString();
    var num4= Math.floor (Math.random()*9 + 1).toString();
    var num5= Math.floor (Math.random()*9 + 1).toString();
    var num6= Math.floor (Math.random()*9 + 1).toString();
    
    var msgEntered = '<span style="color: #5CB85C">'+'has entered the chat'+'</span>';
    var msgLeft = '<span style="color: #D9534F">'+'has left the chat'+'</span>';
    
    var messagesDiv= document.getElementById("messagesDiv");
    
    var userid= num1+num2+num3+num4+num5+num6;
    
    var myDataRef = new Firebase('https://burning-torch-3754.firebaseio.com/users');
    
    var amOnline = new Firebase('https://burning-torch-3754.firebaseio.com/.info/connected');
    
    var ref = new Firebase('https://burning-torch-3754.firebaseio.com/presence');
    
    var isTyping= "is typing ";
    
    var isTypingRefInfo= new Firebase('https://burning-torch-3754.firebaseio.com/nowtyping/');
    
    /*amOnline.on('value', function(snapshot) {
      if (snapshot.val()) {
        userRef.onDisconnect().remove();
        userRef.set(true);
      }
    });*/
    
    function getAllConnected(){
        ref.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
    
                // key will be "fred" the first time and "barney" the second time
                var key = childSnapshot.key();
                console.log(key);    
                // childData will be the actual contents of the child
                var childData = childSnapshot.val();
                console.log(childData);
                $('#ppl-connected').append('<li>'+key+' '+childData+'</li>');    
            });
        });
    }; 
     
    // Retrieve new posts as they are added to our database
    ref.on("child_added", function(snapshot) {
        $('#ppl-connected').html("");
        getAllConnected();  
    });
    
    ref.on("child_changed", function(snapshot) {
        $('#ppl-connected').html("");
        getAllConnected(); 
    });
    
    ref.on("child_removed", function(snapshot) {
        $('#ppl-connected').html("");
        getAllConnected(); 
    });

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

    $('#messageInput').keypress(function (e) {
        var salert= document.getElementById("salert");  
        var name = $('#nameInput').val();
        var text = $('#messageInput').val();
        
        if (e.keyCode === 13) {
            if (!text) {
                $('#messageInput').addClass('alert');
            }
            else{
                isTypingRefInfo= new Firebase('https://burning-torch-3754.firebaseio.com/nowtyping/' + userid);
                isTypingRefInfo.remove();
                
                myDataRef.push({name: name, text: text, id: userid});
                $('#messageInput').removeClass('y onY').val('').change();
                $('#messageInput').val('');
            }  
        }
    });
    
    isTypingRefInfo.on("child_removed", function(snapshot) {
        $('.typing').html("");
        isTypingNow();
    });
    
    isTypingRefInfo.on('child_added', function(snapshot) {
        $('.typing').html("");
        isTypingNow();
    });
    
    function isTypingNow(){
        var name = $('#nameInput').val();
        isTypingRefInfo= new Firebase('https://burning-torch-3754.firebaseio.com/nowtyping/');
        isTypingRefInfo.once("value", function(snapshot) {
                
            snapshot.forEach(function(childSnapshot) {
                childSnapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key();
                    var idSnapshot= childSnapshot.val(); 
                    
                    $('.typing').append('<div calss="typingNow"><i>'+key+' '+idSnapshot+' <img src="typing.gif"></i></div>');
                });
            });
        });
        
        $('#message-holder')[0].scrollTop = $('#message-holder')[0].scrollHeight;
    };
    

    myDataRef.on('child_added', function(snapshot) {
        var message = snapshot.val();
        displayChatMessage(message.name, message.text);
    });
    
    function displayChatMessage(name, text) {    
        $('<div/>').html(text).prepend($('<em/>').html(name+': ')).appendTo($('#messagesDiv'));
        $('#message-holder')[0].scrollTop = $('#message-holder')[0].scrollHeight;
    };

    $('#nameInput').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            var name = $('#nameInput').val();
            var text = $('#messageInput').val();

            if (!name) {
                $('#nameInput').addClass('alert');
            }
            else{
                var userRef = new Firebase('https://burning-torch-3754.firebaseio.com/presence/' + name);
                amOnline.on('value', function(snapshot) {
                    if (snapshot.val()) {
                        userRef.set('★ online');
                    }
                });
                
                $('#access').addClass('hidden');
                $('#granted').removeClass('hidden'); 
                myDataRef.push({name: name, text: msgEntered, id: userid});
                $('#messageInput').focus();
            }
        }
    });

    function tog(v){return v?'addClass':'removeClass';} 
        $(document).on('input', '.enter', function(){
          
            $('#nameInput').removeClass('alert');
            
            $(this)[tog(this.value)]('x');
            
        }).on('mousemove', '.x', function( e ){
            $(this)[tog(this.offsetWidth-80 < e.clientX-this.getBoundingClientRect().left)]('onX');
        }).on('touchstart click', '.onX', function( ev ){
            var name = $('#nameInput').val();

            ev.preventDefault();
            
            var userRef = new Firebase('https://burning-torch-3754.firebaseio.com/presence/' + name);
            amOnline.on('value', function(snapshot) {
                if (snapshot.val()) {
                    userRef.set('★ online');
                }
            });
            
            $('#access').addClass('hidden');
            $('#granted').removeClass('hidden'); 
            $('#messageInput').focus();
            myDataRef.push({name: name, text: msgEntered, id: userid});
    });
    
    //-------------------------------------------------------------------------
    
    function tog2(v){return v?'addClass':'removeClass';}
    
        $(document).on('input', '.send', function(){
          
            $('#messageInput').removeClass('alert');
            
            /*if( $(this).val().length == 0){
              isTypingRefInfo.remove();
              $('#messageInput').removeClass('y onY').val('').change();
              $('#messageInput').val('');
            }*/
            
            var toggy = tog2(this.value);
            var name = $('#nameInput').val();
            isTypingRefInfo= new Firebase('https://burning-torch-3754.firebaseio.com/nowtyping/' + userid+ '/' + name);
            if (toggy=="addClass") {
                var name = $('#nameInput').val();
                isTypingRefInfo.set(isTyping);
            }
            else if (toggy=="removeClass") {
                isTypingRefInfo.remove();
            }
            
            $(this)[tog2(this.value)]('y');
        }).on('mousemove', '.y', function( e ){
            $(this)[tog2(this.offsetWidth-80 < e.clientX-this.getBoundingClientRect().left)]('onY');    
        }).on('touchstart click', '.onY', function( ev ){
            var text = $('#messageInput').val();
            var name = $('#nameInput').val();
            
            isTypingRefInfo.remove();
            
            ev.preventDefault();
            $(this).removeClass('y onY').val('').change();
            
            myDataRef.push({name: name, text: text});
            $('#messageInput').val('');
    });
    
    $(window).on('beforeunload ',function() {
        var name = $('#nameInput').val();
        
        var userRef = new Firebase('https://burning-torch-3754.firebaseio.com/presence/' + name);
        
        if ($('#granted').hasClass('hidden')){
            //do nothing
        }
        else {
          amOnline.on('value', function(snapshot) {
            if (snapshot.val()) {
              userRef.onDisconnect().remove();
              isTypingRefInfo.remove();
            }
          });
          myDataRef.push({name: name, text: msgLeft, id: userid});  
        }
        
    });
});

