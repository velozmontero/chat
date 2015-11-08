$(document).ready(function(){
    
    $('#nameInput').focus();
    
    var messagesDiv= document.getElementById("messagesDiv");
    
    
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
  
    
    
    var myDataRef = new Firebase('https://jan6mieiiug.firebaseio-demo.com/');

    var msgEntered = 'has entered the chat';

    
    //----- Generate Random color not in use yet -------/>
    function generateColor(txt){
        var a = Math.floor((256-229)*Math.random()) + 230;
        var b = Math.floor((256-229)*Math.random()) + 230;
        var c = Math.floor((256-229)*Math.random()) + 230;

        color = "rgb(" + a + "," + b + "," + c + ")";
    };


    $('#messageInput').keypress(function (e) {
      if (e.keyCode == 13) {
        
        var salert= document.getElementById("salert");  
          
        var name = $('#nameInput').val();
        var text = $('#messageInput').val();
        myDataRef.push({name: name, text: text});
          
        $('#messageInput').val('');
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
                myDataRef.push({name: name, text: msgEntered});
                $('#messageInput').focus();
            }
        }
    });

    function tog(v){return v?'addClass':'removeClass';} 
        $(document).on('input', '.clearable', function(){

            $('#nameInput').removeClass('alert');

            $(this)[tog(this.value)]('x');
        }).on('mousemove', '.x', function( e ){
            $(this)[tog(this.offsetWidth-60 < e.clientX-this.getBoundingClientRect().left)]('onX');
        }).on('touchstart click', '.onX', function( ev ){
            var name = $('#nameInput').val();

            ev.preventDefault();
            $('#access').addClass('hidden');
            $('#granted').removeClass('hidden'); 
            myDataRef.push({name: name, text: msgEntered});
    });
});

