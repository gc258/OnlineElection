var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    $scope.onload = function () {
        $scope.viewCustomerData = [];
        $scope.customerData = {};
        $scope.iteamDataModel = {};
        $scope.viewIteamData = [];
        $scope.counter = Array;
        $scope.iteamCount = 0;
        $scope.viewSellData = [];
        $scope.getCustomerTableData();
        $("#addCustomerDivId").show();
        $("#addIteamDivId").hide();
        $("#viewStockDivId").hide();
        $("#sellProductDivId").hide();
    }
    $scope.getCustomerTableData = function () {
        $scope.viewCustomerData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: "https://data-37272-default-rtdb.firebaseio.com/addElectronicCustomer.json",
            success: function (response) {
                for (let i in response) {
                    $scope.viewCustomerData.push(response[i]);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.addCustomer = function () {
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: "https://data-37272-default-rtdb.firebaseio.com/addElectronicCustomer.json",
            data: JSON.stringify($scope.customerData),
            success: function (response) {
                $scope.getCustomerTableData();
                alert("Data submitted sucessfully!!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.getIteamTableData = function () {
        $scope.viewIteamData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: "https://data-37272-default-rtdb.firebaseio.com/addElectronicIteam.json",
            success: function (response) {
                for (let i in response) {
                    let data = response[i];
                    data["iteamId"] = i;
                    $scope.viewIteamData.push(data);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.addIteams = function () {
        if ($scope.iteamDataModel.hasOwnProperty("$$hashKey")) {
            delete $scope.iteamDataModel.$$hashKey;

        }
        $scope.iteamDataModel["manfDate"] = $("#manfDateId").val();
        $scope.iteamDataModel["quantity"] = 0;
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: "https://data-37272-default-rtdb.firebaseio.com/addElectronicIteam.json",
            data: JSON.stringify($scope.iteamDataModel),
            success: function (response) {
                $scope.getIteamTableData();
                alert("Data submitted sucessfully!!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.getQuantity = function (data) {
        $scope.quantityData = data;
    }
    $scope.updateQuantity = function () {
        if ($("#quantityID").val() == "") {
            alert("Please fill required data !!!");
        } else {
            let countQuantity = Number($scope.quantityData.quantity) + Number($("#quantityID").val());
            let reqbody = { 'quantity': countQuantity };
            $.ajax({
                type: 'patch',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: "https://data-37272-default-rtdb.firebaseio.com/addElectronicIteam/" + $scope.quantityData.iteamId + ".json",
                data: JSON.stringify(reqbody),
                success: function (response) {
                    $("#quantityID").val('');
                    $scope.getIteamTableData();
                    $('#quantityModalId').modal('hide');
                    alert("Data updated sucessfully!!!");
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }
    $scope.getSellTableData = function () {
        $scope.viewSellData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: "https://data-37272-default-rtdb.firebaseio.com/addSellData.json",
            success: function (response) {
                for (let i in response) {
                    let data = response[i];
                    data["sellId"] = i;
                    $scope.viewSellData.push(data);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.addSellData = function () {

        let requestbody = { ...$scope.customerDataModel, ...$scope.iteamDataModel };
        requestbody["quantity"] = $scope.iteamDataQuantityModel;
        requestbody["netCost"] = $scope.totalPriceModek;
        if (requestbody.hasOwnProperty("$$hashKey")) {
            delete requestbody.$$hashKey;

        }
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: "https://data-37272-default-rtdb.firebaseio.com/addSellData.json",
            data: JSON.stringify(requestbody),
            success: function (response) {
                $scope.getSellTableData();
                alert("Data submitted sucessfully!!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
        let countQuantity = Number($scope.iteamCount) - Number(requestbody.quantity);
        let reqbody = { 'quantity': countQuantity };
        $.ajax({
            type: 'patch',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: "https://data-37272-default-rtdb.firebaseio.com/addElectronicIteam/" + requestbody.iteamId + ".json",
            data: JSON.stringify(reqbody),
            success: function (response) {

            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.onIteamSelect = function (iteamDataModel) {
        if (iteamDataModel != "" && iteamDataModel.quantity != "" || iteamDataModel.quantity != undefined || iteamDataModel.quantity != null) {
            $scope.iteamCount = iteamDataModel.quantity == "" ? 0 : iteamDataModel.quantity;
            $scope.totalPriceModek = iteamDataModel.iteamPrice == 0 ? iteamDataModel.iteamPrice : iteamDataModel.iteamPrice * $scope.iteamDataQuantityModel;
        }
    }
    $scope.onOrderSelect = function (count) {
        $scope.totalPriceModek = count == "" ? $scope.iteamDataModel.iteamPrice : $scope.iteamDataModel.iteamPrice * count;
    }
    $scope.switchMenu = function (type, id) {
        $(".menuCls").removeClass("active");
        $('#' + id).addClass("active");
        $("#addCustomerDivId").hide();
        $("#addIteamDivId").hide();
        $("#viewStockDivId").hide();
        $("#sellProductDivId").hide();
        if (type == "ADD_CUSTOMER") {
            $scope.customerData = {};
            $("#addCustomerDivId").show();
            $scope.getCustomerTableData();
        } else if (type == "ADD_ITEMS") {
            $scope.iteamDataModel = {};
            $scope.getIteamTableData();
            $("#addIteamDivId").show();
        } else if (type == "VIEW_STOCK") {
            $scope.getIteamTableData();
            $("#viewStockDivId").show();

        } else if (type == "SELL_ITEAM") {
            $scope.getIteamTableData();
            $scope.getSellTableData();
            $scope.iteamCount = 0;
            $scope.totalPriceModek = 0;
            $("#sellProductDivId").show();

        }
    }
});