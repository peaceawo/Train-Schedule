var name;
var departure;
var destination;
var frequency;


var firebaseConfig = {
    apiKey: "AIzaSyBmPop7yHF8hVILhJxUnAuqJTbdDWQbmio",
    authDomain: "train-schedule2-e96c9.firebaseapp.com",
    databaseURL: "https://train-schedule2-e96c9.firebaseio.com",
    projectId: "train-schedule2-e96c9",
    storageBucket: "",
    messagingSenderId: "348242449646",
    appId: "1:348242449646:web:1abe300b4b3ce88a"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //Varable for database
  var database = firebase.database();

  $(document).ready(function(){
      $("#add-train").on("click",function(event){
          event.preventDefault();
          //input variables
          name = $("#name-input").val().trim()
          destination = $("#destination-input").val().trim()
          departure = $("#departure-input").val().trim()
          frequency = $("#frequency-input").val().trim()

          //Push to database
          database.ref().push({
              name: name,
              destination: destination,
              departure: departure,
              frequency: frequency,
              dateAdded: firebase.database.ServerValue.TIMESTAMP
          })

          //Clear input from the form
          $("#name-input").val(" ")
          $("#destination-input").val(" ")
          $("#departure-input").val(" ")
          $("#frequency-input").val(" ")


      })
  })

 //firebase warcher
 database.ref().on("child_added", function(childSnapshot){
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().departure);
    console.log(childSnapshot.val().frequency);




    //Moment varables Activity 20

    // First Time (pushed back 1 year to make sure it comes before current time)
    var departureTimeConverted = moment(departure, "HH:mm");
    console.log(departureTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(departureTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"))

    //next train time in HH:MM format
    var nextTimemin=moment(nextTrain).format("hh:mm")



     //update html

     var addNewRows = $("<tr>").append(
        $("<td>").text(childSnapshot.val().name),
        $("<td>").text(childSnapshot.val().destination),
        $("<td>").text(childSnapshot.val().frequency + "  mins"),
        $("<td>").text(nextTimemin),
        $("<td>").text(tMinutesTillTrain),
        $("<td>").html("<input type='submit' value='remove' class='remove-train btn btn-sm'>")  
      );

     $("#train-table").append(addNewRows)


}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);   
})

$("body").on("click", ".remove-train", function(){
    $(this).closest ("tr").remove();
    var key = $(this).parent().parent().attr("id");
    database.child(key).remove();
});


  

  