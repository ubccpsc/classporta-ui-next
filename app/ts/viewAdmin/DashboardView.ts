import {UI} from "../util/UI";
import {SortableTable, TableCell, TableHeader} from "../util/SortableTable";
import {OnsSelectElement} from "onsenui";
import {Network} from "../util/Network";
import {AdminController} from "../controllers/AdminController";

declare var myApp: any;

interface DashboardPayloadContainer {
    response: DashboardRow[];
}

interface DashboardRow {
    timestamp: number;
    project: string;
    user: string;
    url: string;
    scoreOverall: number;
    scoreTest: number;
    scoreCover: number;
    passNames: string[];
    failNames: string[];
    skipNames: string[];
    stdioURL: string;
}

export class DashboardView {

    private data: DashboardPayloadContainer;
    private sortCol: string = 'timestamp';

    private controller: AdminController;

    private table: SortableTable = null;

    constructor(controller: AdminController) {
        this.controller = controller;
    }

    public configure() {
        if (this.controller.deliverables !== null) {
            const delivSelect = document.getElementById('admin-dashboard-deliverable-select') as OnsSelectElement;
            console.log('removing Old');
            while (delivSelect.options.length > 0) {
                console.log('removing');
                delivSelect.remove();
            }

            let option = document.createElement("option");
            option.text = 'Select';
            option.value = 'null';
            (<any>delivSelect).add(option);

            for (let deliv of this.controller.deliverables) {
                let option = document.createElement("option");
                option.text = deliv.id;
                option.value = deliv.id;
                (<any>delivSelect).add(option);
            }


        }
    }

    public updateTitle() {
        // document.querySelector('#adminTabsHeader').innerHTML = data.course;
        document.querySelector('#adminTabsHeader').innerHTML = "Dashboard";

    }

    public render(data: DashboardPayloadContainer) {
        console.log('DashboardView::render(..) - start');

        this.data = data;
        this.updateTitle();

        try {
            var dashList = document.querySelector('#admin-dashboard-table');
            if (dashList !== null) {
                dashList.innerHTML = '';

                let headers: TableHeader[] = [];
                headers.push({id: 'info', text: 'Info', sortable: false, defaultSort: false, sortDown: true});
                headers.push({id: 'timestamp', text: 'Date', sortable: true, defaultSort: true, sortDown: true});
                headers.push({id: 'project', text: 'Project', sortable: true, defaultSort: false, sortDown: true});
                headers.push({id: 'user', text: 'User', sortable: true, defaultSort: false, sortDown: true});
                headers.push({id: 'scoreOverall', text: '% Overall', sortable: true, defaultSort: false, sortDown: true});
                headers.push({id: 'scoreTest', text: '% Test', sortable: true, defaultSort: false, sortDown: true});
                headers.push({id: 'scoreCover', text: '% Cover', sortable: true, defaultSort: false, sortDown: true});
                headers.push({id: 'passNames', text: '# Pass', sortable: true, defaultSort: false, sortDown: true});
                headers.push({id: 'failNames', text: '# Fail', sortable: true, defaultSort: false, sortDown: true});
                headers.push({id: 'skipNames', text: '# Skip', sortable: true, defaultSort: false, sortDown: true});
                headers.push({id: 'results', text: 'Results', sortable: false, defaultSort: false, sortDown: true});

                let table = new SortableTable(headers);
                this.table = table;

                let rows: any[] = [];
                for (let row of data.response) {
                    let r: TableCell[] = [];

                    //    str += '<td class="dashRowElem"><a style="cursor: pointer; cursor: hand;" onclick="myApp.adminController.dashboardView.renderInfo(\'' + row.stdioURL + '\');"><ons-icon icon="ion-ios-help-outline"</ons-icon></a></td>';
                    r.push({
                        value: '',
                        html:  '<a style="cursor: pointer; cursor: hand;" onclick="myApp.adminController.dashboardView.renderInfo(\\\'\' + row.stdioURL + \'\\\');"><ons-icon icon="ion-ios-help-outline"</ons-icon></a>'
                    });
                    // str += '<td class="dashRowElem"><span title="' + new Date(row.timestamp).toISOString() + '">' + new Date(row.timestamp).toLocaleTimeString() + '</span></td>';
                    r.push({
                        value: row.timestamp,
                        html:  '<span title="' + new Date(row.timestamp).toISOString() + '">' + new Date(row.timestamp).toLocaleTimeString() + '</span>'
                    });
                    // str += '<td class="dashRowElem"><a href="' + row.url + '">' + row.project + '</a></td>';
                    r.push({
                        value: row.project,
                        html:  '<a href="' + row.url + '">' + row.project + '</a>'
                    });
                    // str += '<td class="dashRowElem"><a href="https://github.ubc.ca/' + row.user + '">' + row.user + '</a></td>';
                    r.push({
                        value: row.user,
                        html:  '<a href="https://github.ubc.ca/' + row.user + '">' + row.user + '</a>'
                    });
                    // str += '<td class="dashRowElem">' + row.scoreOverall + '</td>';
                    r.push({
                        value: row.scoreOverall + '',
                        html:  row.scoreOverall + ''
                    });
                    // str += '<td class="dashRowElem">' + row.scoreTest + '</td>';
                    r.push({
                        value: row.scoreTest + '',
                        html:  row.scoreTest + ''
                    });
                    // str += '<td class="dashRowElem">' + row.scoreCover + '</td>';
                    r.push({
                        value: row.scoreCover + '',
                        html:  row.scoreCover + ''
                    });
                    // str += '<td class="dashRowElem">' + row.passNames.length + '</td>';
                    r.push({
                        value: row.passNames.length + '',
                        html:  row.passNames.length + ''
                    });
                    // str += '<td class="dashRowElem">' + row.failNames.length + '</td>';
                    r.push({
                        value: row.failNames.length + '',
                        html:  row.failNames.length + ''
                    });
                    // str += '<td class="dashRowElem">' + row.skipNames.length + '</td>';
                    r.push({
                        value: row.skipNames.length + '',
                        html:  row.skipNames.length + ''
                    });
                    // str += '<td class="dashRowElem">' + this.getDetails(row) + '</td>';
                    r.push({
                        value: '',
                        html:  this.getDetails(row)
                    });

                    rows.push(r);
                    table.addRow(r);
                }


                table.generate('#admin-dashboard-table');

                var dashFooter = document.querySelector('#admin-dashboard-footer');
                dashFooter.innerHTML = this.buildFooter();

            } else {
                console.log('DashboardView::render(..) - element is null');
            }
        } catch (err) {
            console.log('DashboardView::render(..) - ERROR: ' + err.message);
        }
        UI.hideModal();
    }

    private buildFooter() {
        let str = '<div style="text-align:center; padding-top: 1em; padding-bottom: 1em;">'; // TODO: add footer (grade histogram, xy scatter (x=coverage, y=grade))
        str += '<div><b>Deliverable Statistics</b></div>';

        let totalProjects = 0;
        let totalScore = 0;
        let scores: number[] = [];
        let histo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var d of this.data.response) {
            totalProjects++;
            const score = Number(d.scoreOverall);
            totalScore = totalScore + score;
            scores.push(score);
            let bucket = Math.floor(score / 10);
            // avoid -1
            bucket = Math.max(bucket, 0);
            histo[bucket] = histo[bucket] + 1;
        }

        scores = scores.sort(function (a, b) {
            return a - b;
        });

        str += '<div><b>Median:</b> ' + (scores[Math.ceil(scores.length / 2)]).toFixed(2) + '</div>';
        str += '<div><b>Average:</b> ' + (totalScore / totalProjects).toFixed(2) + '</div>';
        str += '<div><b># Rows:</b> ' + totalProjects + '</div>';

        str += '<div style="padding-top: 1em"><b>Histogram:</b></div>';
        str += '<table style="margin-left: auto; margin-right: auto;">'; // <tr><th>Bucket</th><th>Count</th></tr>
        str += '<tr><td class="dashHistoBucket" style="text-align: left;"># 0%-9%</td><td class="dashHistoValue" style="text-align: right;">' + histo[0] + '</td></tr>';
        str += '<tr><td class="dashHistoBucket" style="text-align: left;"># 10%-19%</td><td class="dashHistoValue" style="text-align: right;">' + histo[1] + '</td></tr>';
        str += '<tr><td class="dashHistoBucket" style="text-align: left;"># 20%-29%</td><td class="dashHistoValue" style="text-align: right;">' + histo[2] + '</td></tr>';
        str += '<tr><td class="dashHistoBucket" style="text-align: left;"># 30%-39%</td><td class="dashHistoValue" style="text-align: right;">' + histo[3] + '</td></tr>';
        str += '<tr><td class="dashHistoBucket" style="text-align: left;"># 40%-49%</td><td class="dashHistoValue" style="text-align: right;">' + histo[4] + '</td></tr>';
        str += '<tr><td class="dashHistoBucket" style="text-align: left;"># 50%-59%</td><td class="dashHistoValue" style="text-align: right;">' + histo[5] + '</td></tr>';
        str += '<tr><td class="dashHistoBucket" style="text-align: left;"># 60%-69%</td><td class="dashHistoValue" style="text-align: right;">' + histo[6] + '</td></tr>';
        str += '<tr><td class="dashHistoBucket" style="text-align: left;"># 70%-79%</td><td class="dashHistoValue" style="text-align: right;">' + histo[7] + '</td></tr>';
        str += '<tr><td class="dashHistoBucket" style="text-align: left;"># 80%-89%</td><td class="dashHistoValue" style="text-align: right;">' + histo[8] + '</td></tr>';
        str += '<tr><td class="dashHistoBucket" style="text-align: left;"># 90%-99%</td><td class="dashHistoValue" style="text-align: right;">' + histo[9] + '</td></tr>';
        str += '<tr><td class="dashHistoBucket" style="text-align: left;"># 100%</td><td class="dashHistoValue" style="text-align: right;">' + histo[10] + '</td></tr>';
        str += '</table>';

        str += '</div>';
        return str;
    }

    private getDetails(row: any) {
        let passNames = row.passNames as string[];
        let failNames = row.failNames as string[];
        let skipNames = row.skipNames as string[];

        let all: string[] = [];
        all = all.concat(passNames, failNames, skipNames);
        all = all.sort();

        interface DetailRow {
            name: string;
            state: string;
            colour: string;
        }

        let annotated: DetailRow[] = [];
        for (var name of all) {
            let state = 'unknown';
            let colour = 'black';
            if (failNames.indexOf(name) > 0) {
                state = 'fail';
                colour = 'red';
            } else if (passNames.indexOf(name) >= 0) {
                state = 'pass';
                colour = 'green';
            } else if (skipNames.indexOf(name) >= 0) {
                state = 'skip';
                colour = 'grey';
            } else {
                // uhoh
            }
            annotated.push({name: name, state: state, colour: colour});
        }

        let str = '<span><table style="height: 20px;">';
        str += '<tr>';

        for (let a of annotated) {
            str += '<td class="dashResultCell" style="width: 5px; height: 20px; background: ' + a.colour + '" title="' + a.name + '"></td>';
        }

        str += '</tr>';
        str += '</table></span>';
        return str;
    }

    public retrieveDashboard() {
        console.log('DashboardView::retrieveDashboard() - start');
        const delivSelect = document.getElementById('admin-dashboard-deliverable-select') as OnsSelectElement;
        const teamSelect = document.getElementById('admin-dashboard-team-select') as OnsSelectElement;

        if (delivSelect !== null && teamSelect !== null) {
            let delivId = delivSelect.value;
            let teamId: string | null = teamSelect.value;
            console.log('DashboardView::retrieveDashboard() - delivId: ' + delivId + '; teamId: ' + teamId);
            if (teamId === 'null') {
                teamId = null;
            }
            if (delivId === 'null') {
                delivId = null;
                UI.showErrorToast("Please select a deliverable.");
            } else {
                myApp.adminController.adminDashboardPage(delivId, teamId);
            }

        } else {
            console.log('DashboardView::retrieveDashboard() - select is null');
        }
    }

    public sort(columnName: string) {
        if (columnName === 'info' || columnName === 'results') {
            console.log('DashboardView::sort( ' + columnName + ' ) - unsortable column; not doing anything');
            // do nothing
            return;
        }

        let mult = 1;
        if (this.sortCol === columnName) {
            mult = -1;
            this.sortCol = '';
        } else {
            this.sortCol = columnName;
        }

        console.log('DashboardView::sort( ' + columnName + ' ) - mult: ' + mult + '; - start');
        this.data.response = this.data.response.sort(function (a, b) {

            let aVal = a[columnName];
            let bVal = b[columnName];

            if (Array.isArray(aVal)) {
                // an array
                return (aVal.length - bVal.length) * mult;
            } else if (isNaN(aVal) === false) {
                // as a number
                // something that isn't an array or string
                return (Number(aVal) - Number(bVal)) * mult;
            } else if (typeof aVal === 'string') {
                // as a string
                return aVal.localeCompare(bVal) * mult;
            } else {
                // something that isn't an array or string or number
                return (aVal - bVal) * mult;
            }
        });

        this.render(this.data);
    }

    public renderInfo(url: string) {
        console.log('DashboardView::renderInfo( ' + url + ' )');

        const onSuccess: any = {};
        onSuccess.render = function (data: any) {
            console.log('DashboardView::renderInfo(..) - onSuccess::render');
            const newWindow = window.open('text/plain');
            data = data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/g, "<br/>");
            newWindow.document.write(data);
        };

        // TODO: this network code should probably be in a controller?
        Network.handleRemoteText(url, onSuccess, UI.handleError);
    }

}