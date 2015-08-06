$("#button01").click(function() {
    
    function get_name(string) {
        var s1 = ["小隊長", "偵查佐", "副所長"];
        var s2 = ["所長", "警員", "巡佐", "隊長"];
        var s3 = ["等"];
        if (string.includes(s3[0])) {
            string = string.substring(0, string.search(s3[0]));
        }
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




    var mydata = [];
    var winner = {};
    var lines = $("#textarea01").val().split("\n");
    if (lines[lines.length-1] === "") {
        lines.pop();
    }
    for (var i in lines) {
        var element = {};
        var index_ = 0;
        var s = lines[i];
        element['id'] = i;
        index_ = 4
        element['日期'] = s.substring(0, index_);
        s = s.substring(index_);
        index_ = s.search('所') + 1;
        if (index_ === 0) index_ = s.search('隊') + 1;
        element['單位'] = s.substring(0, index_);
        s = s.substring(index_);
        index_ = s.search('，');
        element['人員'] = s.substring(0, index_).split('、');
        s = s.substring(index_);
        index_ = s.search('查獲') + 2;
        s = s.substring(index_);
        index_ = s.search('。');
        element['案類'] = s.substring(0, index_);
        element['備註'] = s.substring(index_ + 1);

        mydata.push(element);
    }

    //var people = [];
    var people_counter = 0;
    var people_list = {};
    for (var d in mydata) {
        for (var p in mydata[d]['人員']) {
            var element = mydata[d]['人員'][p];
            element = get_name(element);
            if (element in people_list) {
                people_list[element]['times']++;
            } else {
                people_counter++;
                people_list[element] = {
                    'order' : people_counter,
                    'times' : 1,
                };
            }
        }
        //console.log(mydata[d]);
    }
    //console.log();
    //console.log(people_list);

    for (var d in mydata) {
        mydata[d]['times'] = 0;
        mydata[d]['受獎人員排序'] = 99;
        var q;
        for (var p in mydata[d]['人員']) {
            q = mydata[d]['人員'][p];
            q = get_name(q);
            if (people_list[q]['times'] >= mydata[d]['times'] && people_list[q]['order'] < mydata[d]['受獎人員排序']) {
                mydata[d]['times'] = people_list[q]['times'];
                mydata[d]['受獎人員排序'] = people_list[q]['order'];
                mydata[d]['受獎人員'] = q;
            }
        }
    }
    console.log(mydata);

    console.log(JSON.stringify(mydata));
    
    for (var c in mydata) {
        $("#table01").append("<tr>");
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['id']);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['日期']);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['單位']);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['人員']);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['案類']);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['受獎人員']);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]['備註']);
    }



    return;
    
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
        
        $("#table01").append("<tr>");
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(parseInt(c)+1);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]["日期"]);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]["單位"]);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]["人員"]);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]["案類"]);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]["受獎者"]);
        $("#table01 tr:last-child").append("<td>");
        $("#table01 tr:last-child td:last-child").append(mydata[c]["備註"]);
    }
    
    $("#table01").append("<tr>");
    $("#table01 tr:last-child").append("<td>");
    $("#table01 tr:last-child td:last-child").append("-");
    $("#table01 tr:last-child").append("<td>");
    $("#table01 tr:last-child td:last-child").append("-");
    $("#table01 tr:last-child").append("<td>");
    $("#table01 tr:last-child td:last-child").append("-");
    $("#table01 tr:last-child").append("<td>");
    $("#table01 tr:last-child td:last-child").append("-");
    $("#table01 tr:last-child").append("<td>");
    $("#table01 tr:last-child td:last-child").append("-");
    $("#table01 tr:last-child").append("<td>");
    $("#table01 tr:last-child td:last-child").append("-");
    $("#table01 tr:last-child").append("<td>");
    $("#table01 tr:last-child td:last-child").append("-");
    
    for (var e in sortable) {
        $("#result01").append(sortable[e][0] + " : " + sortable[e][1]);
        if (sortable[e][2]) {
            $("#result01").append("&#x1f448;<br>");
        } else {
            $("#result01").append("<br>");
        }
    }
    //console.log(JSON.stringify(sortable));
});