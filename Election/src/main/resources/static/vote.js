var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    var URL = "https://fir-1c7de-default-rtdb.firebaseio.com";
    $scope.onload = function () {
        $scope.viewUserData = [];
        $scope.candidateDetails = "";
        $scope.getUserTableData();
        $("#viewCandidateDivId").show();
        $("#castVoteDivId").hide();
        $("#viewResultDivId").hide();
    }

    $scope.getUserTableData = function () {

        $scope.viewUserData = [];
        let userData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/voteRegister.json",
            success: function (response) {
                for (let i in response) {
                    let data = response[i];
                    data["userId"] = i;
                    userData.unshift(data);
                }
                $scope.viewUserData = userData.filter(function (obj) {
                    return obj.selfNomine;
                })
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.voteCandidate = function () {
        if ($scope.candidateDetails === "" || $scope.candidateDetails === undefined || $scope.candidateDetails === null) {
            alert("Please candidate name");
        } else {
            let count = $scope.candidateDetails.voterCount + 1;
            let requestBody = {
                "voterCount": count
            }
            $.ajax({
                type: 'patch',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + "/voteRegister/" + $scope.candidateDetails.userId + ".json",
                data: JSON.stringify(requestBody),
                success: function (response) {
                    $scope.switchMenu("VIEW_RESULT", "viewResultDivId");
                    alert("Voted sucessfully!!!");
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }
    $scope.logout = function () {
        window.location.href = "voteLogReg.html";
    }
    $scope.switchMenu = function (type, id) {
        $(".menuCls").removeClass("active");
        $('#' + id).addClass("active");
        $("#viewCandidateDivId").hide();
        $("#castVoteDivId").hide();
        $("#viewResultDivId").hide();
        if (type == "VIEW-CANDIDATE") {
            $scope.getUserTableData();
            $("#viewCandidateDivId").show();
        } else if (type == "CAST_VOTE") {
            $scope.candidateDetails = "";
            $scope.getUserTableData();
            $("#castVoteDivId").show();
        } else if (type == "VIEW_RESULT") {
            $scope.getUserTableData();
            $("#viewResultDivId").show();
        }

    }
});
