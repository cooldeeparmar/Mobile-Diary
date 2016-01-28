var request = window.indexedDB.open("mobilediary", 3);
request.onupgradeneeded = function(event) {
	  var db = event.target.result;
	  //subject table
	  if (!db.objectStoreNames.contains("subjects")) {

	  	 var objectStore = db.createObjectStore("subjects", { keyPath: "id",autoIncrement:true });
	  	  objectStore.createIndex("Title", "Title", { unique: false });
	  }
     // Entries table
	  if (!db.objectStoreNames.contains("entries")) {

	  	 var objectStore = db.createObjectStore("entries", { keyPath: "entry_id",autoIncrement:true });
	  	  objectStore.createIndex("Title", "Title", { unique: false });
	  	  objectStore.createIndex("subject", "subject", { unique: false });
	  	  objectStore.createIndex("date", "date", { unique: false });
	  	  objectStore.createIndex("body", "body", { unique: false });

	  }

 }
request.onsuccess = function( event ) { 
   console.log('asdas');
   db= event.target.result;
   getsubject();
   mobilediary.onPageInit('index', function (page) {
       getsubject();
    });
    mobilediary.onPageInit('new-entry', function (page) {
       getsubjectlist();
    });
 };

 function addSubject()
 {
    	var title=$('#title').val();
    	var os = db.transaction(['subjects'], "readwrite");
    	var store=os.objectStore('subjects');

    	var subject={
    		title:title
    	}
      var request=store.add(subject);

      request.onsuccess = function(event) {
         console.log('subject'+event)
      }
      request.onerror = function(event) {
         console.log('subject error')
      }

 }
 function getsubject()
 {
    	var os = db.transaction(['subjects'], "readonly");
    	var store=os.objectStore('subjects');

    	//var index=store.index('title');

    	var output='';

    	store.openCursor().onsuccess = function(event) {
    	 	   var cursor = event.target.result;
                if(cursor) {
			     output +='<li><a href="entries.html" onClick="getenties('+cursor.value.id+')" class="item-link">'+
                        '<div class="item-content">'+
                           '<div class="item-inner">'+ 
                             '<div class="item-title">'+cursor.value.title+'</div>'+
                          '</div>'+
                          '</div></a></li>';

			      cursor.continue();
			    } 
               $('#subjectlist').html(output);
    	 }
 }

function getsubjectlist(current)
 {
    	var os = db.transaction(['subjects'], "readonly");
    	var store=os.objectStore('subjects');

    	//var index=store.index('title');

    	var output='';

    	store.openCursor().onsuccess = function(event) {
    	 	   var cursor = event.target.result;
                if(cursor) {
                     if (cursor.value.id== current) {
 						 output +='<option value="'+cursor.value.id+'" selected>'+cursor.value.title+'</option>';		
                     }
                     else
                     {
                     	 output +='<option value="'+cursor.value.id+'">'+cursor.value.title+'</option>';		
                     } 
        			    

			      cursor.continue();
			    } 
               $('#subject').html(output);
    	 }
 }


function addEntry()
{
    	var title=$('#title').val();
    	var subject=$('#subject').val();
    	var date=$('#datePicker').val();
    	var body=$('#body').val();


    	var os = db.transaction(['entries'], "readwrite");
    	var store=os.objectStore('entries');

    	var Entries={
    		Title:title,
    		date:date,
    		body:body,
    		subject:subject
    	}
      var request=store.add(Entries);

      request.onsuccess = function(event) {
         console.log('subject'+event)
      }
      request.onerror = function(event) {
         console.log('subject error')
      }
}
function getenties(subjectid)
{
    mobilediary.onPageInit('entries', function (page) {
       getSubjectTitle(subjectid);

          var os = db.transaction(['entries'], "readonly");
        var store=os.objectStore('entries');

        //var index=store.index('title');

        var output='';

        store.openCursor().onsuccess = function(event) {
             var cursor = event.target.result;
                  if(cursor) {
                    if (subjectid==cursor.value.subject) {    
                   output +='<li><a  onClick="getentrydetail('+cursor.value.entry_id+')" href="entry.html" class="item-link">'+
                          '<div class="item-content">'+
                             '<div class="item-inner">'+ 
                               '<div class="item-title">'+cursor.value.Title+'</div>'+
                            '</div>'+
                            '</div></a></li>';
                         };
              cursor.continue();
            } 
                 $('#entries').html(output);
         }
    });

   
}


function getSubjectTitle(id)
{
  
          var os = db.transaction(['subjects'], "readonly");
          var store=os.objectStore('subjects');
          var request=store.get(id);
          request.onsuccess = function(event) {
             var output = request.result.title;
              $('#SubjectTitle').html(output);    

          }
         
       
}

function getentrydetail(id)
{
    mobilediary.onPageInit('entry', function (page) {
        var os = db.transaction(['entries'], "readonly");
        var store=os.objectStore('entries');
        var output='';
        var request=store.get(id);
        request.onsuccess = function(event) {
               output +='<h3>'+request.result.Title+'</h3>'+
                         '<p> Posted on:: '+request.result.date+'</p>'+
                          '<p>'+request.result.body+'</p>';
              $('#entryd').html(output);    
             
              $('#deletebtn').html('<a href="index.html" onClick="removeentry('+id+')" class="button button-big button-fill color-red">Delete</a>');    
          }   
    });
}
function removeentry(id)
{
        var os = db.transaction(['entries'], "readwrite");
        var store=os.objectStore('entries');
        var request=store.delete(id);
        

}