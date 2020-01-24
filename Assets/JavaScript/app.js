$(document).ready(function () {

    $("#empTable").DataTable();
    $(".dataTables_length").addClass("bs-select");

  var netflixExpiresLocal = JSON.parse(localStorage.getItem("netflixExpireSoon"));
  var netflixNewLocal = JSON.parse(localStorage.getItem("netflixNew"));
  console.log(netflixExpiresLocal);

  $('#newContent').on('click', loadNewContent);
  $('#expiringContent').on('click', loadExpiringContent);

  function loadExpiringContent() {
    //resets table body
    $("#titleContainer").remove();
    var tableBody = $("<tbody>").attr("id", "titleContainer");
    $("#empTable").append(tableBody);
    if (netflixExpiresLocal == null || moment().format("MM/DD/YY") > moment(netflixExpiresLocal.timeStamp).add(1, 'days')) {
      //Expires Soon Query
      var settingsExpiring = {
        "async": true,
        "crossDomain": true,
        "url": "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=get%3Aexp%3AUS&t=ns&st=adv&p=1",
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
          "x-rapidapi-key": "e138a5e326mshee193d9b02e3dafp19cc7djsn4aa0ac2244fa"
        }
      }

      $.ajax(settingsExpiring).done(function (netflixResponse) {
        console.log(netflixResponse);

        var netflixExpiresSoon = netflixResponse;
        netflixExpiresSoon.timeStamp = moment().format("MM/DD/YY");

        for (let i = 0; i < netflixResponse.ITEMS.length; i++) {
          if (netflixResponse.ITEMS[i].imdbid != "") {
            var queryURL = "https://www.omdbapi.com/?i=" + netflixResponse.ITEMS[i].imdbid + "&apikey=trilogy";

            // Creating an AJAX call for the specific movie button being clicked
            $.ajax({
              url: queryURL,
              method: "GET"
            }).then(function (omdbResponse) {
              console.log(omdbResponse);
              netflixExpiresSoon.ITEMS[i].omdbData = omdbResponse;
              localStorage.setItem('netflixExpireSoon', JSON.stringify(netflixExpiresSoon));

              addContentRow(omdbResponse, i);
            });
          }
        }
      });
    } else {
      for (let i = 0; i < netflixExpiresLocal.ITEMS.length; i++) {
        if (netflixExpiresLocal.ITEMS[i].imdbid != "") {
          addContentRow(netflixExpiresLocal.ITEMS[i].omdbData, i);
        }
      }
    }
  }

  //New Releases Query
  function loadNewContent() {
    //resets table body
    $("#titleContainer").remove();
    var tableBody = $("<tbody>").attr("id", "titleContainer");
    $("#empTable").append(tableBody);
    if (netflixNewLocal == null || moment().format("MM/DD/YY") > moment(netflixNewLocal.timeStamp).add(1, 'days')) {
      var daysSinceRelease = 7;
      var resultsPage = 1;
      var settingsNew = {
        "async": true,
        "crossDomain": true,
        "url": "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=get%3Anew" + daysSinceRelease + "%3AUS&p=" + resultsPage + "&t=ns&st=adv",
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
          "x-rapidapi-key": "e138a5e326mshee193d9b02e3dafp19cc7djsn4aa0ac2244fa"
        }
      }

      $.ajax(settingsNew).done(function (netflixResponse) {
        console.log(netflixResponse);

        var netflixNewLocal = netflixResponse;
        netflixNewLocal.timeStamp = moment().format("MM/DD/YY");

        for (let i = 0; i < netflixResponse.ITEMS.length; i++) {
          if (netflixResponse.ITEMS[i].imdbid != "") {
            var queryURL = "https://www.omdbapi.com/?i=" + netflixResponse.ITEMS[i].imdbid + "&apikey=trilogy";

            // Creating an AJAX call for the specific movie button being clicked
            $.ajax({
              url: queryURL,
              method: "GET"
            }).then(function (omdbResponse) {
              console.log(omdbResponse);
              netflixNewLocal.ITEMS[i].omdbData = omdbResponse;
              localStorage.setItem('netflixNew', JSON.stringify(netflixNewLocal));

              addContentRow(omdbResponse, i);
            });
          }
        }
      });
    } else {
      for (let i = 0; i < netflixNewLocal.ITEMS.length; i++) {
        if (netflixNewLocal.ITEMS[i].imdbid != "") {
          addContentRow(netflixNewLocal.ITEMS[i].omdbData, i);
        }
      }
    }
  }

  //adds content rows
  function addContentRow(omdbObject, itemIndex) {
    var newRow = $('<tr data-toggle="collapse" data-target="#collapse' + itemIndex + '" class="clickable">');
    newRow.append($('<td style="font-weight:bold;">').text(omdbObject.Title));

    if (omdbObject.Poster === "N/A"){
      var posterTD =$("<td>");
      var missingPosterImageLink = 'Assets/Images/noimage.jpg';
      var missingPosterImg = $("<img>").attr("id","titlePoster").attr("src",missingPosterImageLink);
      posterTD.append(missingPosterImg);
      newRow.append(posterTD);
    }
    else{
      var posterTD =$("<td>");
      var posterImage = omdbObject.Poster;
      var posterImg = $("<img>").attr("id","titlePoster").attr("src",posterImage);
      posterTD.append(posterImg);
      newRow.append(posterTD);
    }

    newRow.append($("<td>").text(omdbObject.Genre));
    newRow.append($("<td>").text(omdbObject.Rated));
    newRow.append($("<td>").text(omdbObject.Runtime));
    newRow.append($("<td>").text(omdbObject.Year));
    newRow.append($("<td>").text(omdbObject.imdbRating));
    newRow.append($("<td>").text(omdbObject.imdbVotes));


    var newWatchedTD = $("<td>");
    newWatchedTD.append($('<input type="checkbox">'));
    newRow.append(newWatchedTD);
    $("#titleContainer").append(newRow);

    // var newRowPlot = $("<tr>");
    // var newPlotTD = $('<td colspan="7">');
    // newPlotTD.append($('<div id="collapse' + itemIndex + '" class="collapse">').text(omdbOject.Plot));
    // newRowPlot.append(newPlotTD)
    // $("tbody").append(newRowPlot);

  };


});