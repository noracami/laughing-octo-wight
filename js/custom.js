$("#button03").click(function() {
    var mydata = [];
    var winner = new Object;
    var lines = $("#textarea03").val().split("\n");
    
    function count_and_save(x, y) {
        if (x in y) {
            y[x]++;
        } else {
            y[x] = 1;
        }
    }

    function sort_by_value(list) {
        var sortable = [];
        for (var v in list) {
            sortable.push([v, list[v], false]);
        }
        sortable.sort(function(a, b) {return a[1] - b[1]});
        sortable.reverse();
        return sortable;
    }

    function get_winner(i, list) {
        for (var w in list) {
            var found = $.inArray(list[w][0], i) > -1;
            if (found) {
                list[w][2] = true;
                return list[w][0];
            }
        }
    }

    var s1 = ["小隊長", "偵查佐", "副所長"];
    var s2 = ["所長", "警員", "巡佐", "隊長"];

    function get_name(string) {
        for (var i in s1) {
            if (string.includes(s1[i])) {
                return string.substring(3);
            }
        }
        for (var i in s2) {
            if (string.includes(s2[i])) {
                return string.substring(2);
            }
        }
        return string;
    }

    for (var i in lines) {
        var columns = lines[i].split("。");
        var element = {};
        var maincontent = columns[0].split("，");
        element["日期"] = maincontent[0].substring(0,4);
        element["單位"] = maincontent[0].substring(4,7);
        element["人員"] = maincontent[0].substring(7);
        element["案類"] = maincontent[2].substring(2, maincontent[2].length - 1);
        if (columns[1].length > 0) {
            element["備註"] = columns[1];
        } else {
            element["備註"] = "&nbsp;";
        }
        var win = element["人員"].split("、");

        for (var j in win) {
            win[j] = get_name(win[j]);
            count_and_save(win[j], winner);
        }
        element["受獎者"] = win;
        mydata.push(element);
    }
    var sortable = sort_by_value(winner);
    for (var c in mydata) {
        mydata[c]["受獎者"] = get_winner(mydata[c]["受獎者"], sortable);
        
        $("#table02").append("<tr>");
        $("#table02 tr:last-child").append("<td>");
        $("#table02 tr:last-child td:last-child").append(mydata[c]["日期"]);
        $("#table02 tr:last-child").append("<td>");
        $("#table02 tr:last-child td:last-child").append(mydata[c]["單位"]);
        $("#table02 tr:last-child").append("<td>");
        $("#table02 tr:last-child td:last-child").append(mydata[c]["人員"]);
        $("#table02 tr:last-child").append("<td>");
        $("#table02 tr:last-child td:last-child").append(mydata[c]["案類"]);
        $("#table02 tr:last-child").append("<td>");
        $("#table02 tr:last-child td:last-child").append(mydata[c]["受獎者"]);
        $("#table02 tr:last-child").append("<td>");
        $("#table02 tr:last-child td:last-child").append(mydata[c]["備註"]);
    }
    for (var e in sortable) {
        $("#result").append(sortable[e][0] + " : " + sortable[e][1]);
        if (sortable[e][2]) {
            $("#result").append("&#x1f448;<br>");
        } else {
            $("#result").append("<br>");
        }
    }
    //console.log(JSON.stringify(sortable));
});