/*! banana-fusion - v1.6.13 - 2016-11-29
 * https://github.com/LucidWorks/banana/wiki
 * Copyright (c) 2016 Andrew Thanalertvisuti; Licensed Apache License */

define("panels/fullTextSearch/module",["angular","app","underscore","kbn","moment","bootstrap"],function(a,b,c,d,e){"use strict";var f=a.module("kibana.panels.fullTextSearch",[]);b.useModule(f),f.controller("fullTextSearch",["$rootScope","$scope","fields","querySrv","dashboard","filterSrv",function(b,e,f,g,h,i){e.panelMeta={modals:[{description:"Inspect",icon:"icon-info-sign",partial:"app/partials/inspector.html",show:e.panel.spyable}],editorTabs:[{title:"Paging",src:"app/panels/table/pagination.html"},{title:"Queries",src:"app/partials/querySelect.html"}],exportfile:!0,status:"Experimental",description:"This panel provide full text search functionality for data"};var j={status:"Stable",queries:{mode:"all",ids:[],query:"*:*",basic_query:"",custom:""},size:100,pages:5,offset:0,group:"default",sort:[],style:{"font-size":"9pt"},overflow:"min-height",fields:[],highlight:[],sortable:!1,header:!0,paging:!0,field_list:!0,trimFactor:300,normTimes:!0,spyable:!0,saveOption:"json",exportSize:100,exportAll:!0,facet_limit:10,foundResults:!0,show_queries:!0};c.defaults(e.panel,j),e.init=function(){e.Math=Math,e.sjs=e.sjs||sjsResource(h.current.solr.server+h.current.solr.core_name),e.$on("refresh",function(){e.get_data()}),e.panel.exportSize=e.panel.size*e.panel.pages,e.fields=f,e.get_data()},e.percent=d.to_percent,e.toggle_micropanel=function(a,b){var f=c.map(e.data,function(a){return a.kibana._source}),g=d.top_field_values(f,a,10,b);e.micropanel={field:a,grouped:b,values:g.counts,hasArrays:g.hasArrays,related:d.get_related_fields(f,a),count:c.countBy(f,function(b){return c.contains(c.keys(b),a)})["true"]}},e.micropanelColor=function(a){var b=["bar-success","bar-warning","bar-danger","bar-info","bar-primary"];return a>b.length?"":b[a]},e.set_sort=function(a){e.panel.sort[0]===a?e.panel.sort[1]="asc"===e.panel.sort[1]?"desc":"asc":e.panel.sort[0]=a,e.get_data()},e.add_facet_field=function(a){c.contains(f.list,a)&&-1===c.indexOf(e.panel.fields,a)&&(e.panel.fields.push(a),e.get_data())},e.remove_facet_field=function(a){c.contains(f.list,a)&&c.indexOf(e.panel.fields,a)>-1&&(e.panel.fields=c.without(e.panel.fields,a))},e.toggle_highlight=function(a){c.indexOf(e.panel.highlight,a)>-1?e.panel.highlight=c.without(e.panel.highlight,a):e.panel.highlight.push(a)},e.toggle_details=function(a){a.kibana.details=a.kibana.details?!1:!0,a.kibana.view=a.kibana.view||"table"},e.page=function(a){e.panel.offset=a*e.panel.size,e.get_data()},e.build_search=function(b,d,f){var g;c.isArray(d)?g="("+c.map(d,function(b){return a.toJson(b)}).join(" AND ")+")":c.isUndefined(d)?(g="*:*",f=!f):g=a.toJson(d),i.set({type:"field",field:b,query:g,mandate:f?"mustNot":"must"}),e.panel.offset=0,h.refresh()},e.facet_label=function(a){return i.translateLanguageKey("facet",a,h.current)},e.fieldExists=function(a,b){i.set({type:"exists",field:a,mandate:b}),h.refresh()},e.get_data=function(a,b){if(e.panel.error=!1,delete e.panel.error,0!==h.indices.length){e.panelMeta.loading=!0,e.panel.queries.ids=g.idsByMode(e.panel.queries);var f=c.isUndefined(a)?0:a;e.segment=f,e.sjs.client.server(h.current.solr.server+h.current.solr.core_name);var j=e.sjs.Request().indices(h.indices[f]),k=e.sjs.BoolQuery();c.each(e.panel.queries.ids,function(a){k=k.should(g.getEjsObj(a))}),j=j.query(e.sjs.FilteredQuery(k,i.getBoolFilter(i.ids))).highlight(e.sjs.Highlight(e.panel.highlight).fragmentSize(2147483647).preTags("@start-highlight@").postTags("@end-highlight@")).size(e.panel.size*e.panel.pages),e.panel_request=j;var l="";i.getSolrFq()&&(l="&"+i.getSolrFq());for(var m=e.panel.size*e.panel.pages,n="&wt=json",o="&facet=true",p="",q=0;q<e.panel.fields.length;q++)p+="&facet.field="+e.panel.fields[q];var r,s="";e.panel.sortable&&e.panel.sort&&void 0!==e.panel.sort[0]&&void 0!==e.panel.sort[1]&&(s="&sort="+e.panel.sort[0]+" "+e.panel.sort[1]),r=void 0!==m&&0!==m?"&rows="+m:"&rows=25";var t;t=e.panel.body_field?"&hl=true&hl.fl="+e.panel.body_field:"",e.panel.queries.basic_query=g.getORquery()+l+o+p+s,e.panel.queries.query=e.panel.queries.basic_query+n+r+t,j=null!=e.panel.queries.custom?j.setQuery(e.panel.queries.query+e.panel.queries.custom):j.setQuery(e.panel.queries.query);var u=j.doSearch();u.then(function(a){if(e.panelMeta.loading=!1,e.panel.offset=0,0===f?(e.hits=0,e.data=[],b=e.query_id=(new Date).getTime()):e.data=[],!c.isUndefined(a.error))return void(e.panel.error=e.parse_error(a.error.msg));if(e.query_id===b){e.data=e.data.concat(c.map(a.response.docs,function(a){var b=c.clone(a);return b.kibana={_source:d.flatten_json(a),highlight:d.flatten_json(a.highlighting||{})},b})),e.hits=a.response.numFound,e.panel.foundResults=0===e.hits?!1:!0,a.highlighting&&(e.highlighting=a.highlighting,e.highlightingKeys=Object.keys(a.highlighting),$.isEmptyObject(e.highlighting[e.highlightingKeys[0]])?e.highlight_flag=!1:e.highlight_flag=!0);var g=a.facet_counts.facet_fields,j={};c.each(e.panel.fields,function(a){j[a]=[];for(var b=0;b<g[a].length;b+=2)j[a].push({value:g[a][b],count:g[a][b+1]})}),e.facet_data=j,e.data=e.data.slice(0,e.panel.size*e.panel.pages),e.panel.sortable&&(e.data.length<e.panel.size*e.panel.pages||!c.contains(i.timeField(),e.panel.sort[0])||"desc"!==e.panel.sort[1])&&f+1<h.indices.length&&e.get_data(f+1,e.query_id)}})}},e.exportfile=function(a){var b="&omitHeader=true",c="&rows="+(e.panel.exportSize||e.panel.size*e.panel.pages),f="";if(!e.panel.exportAll){f="&fl=";for(var g=0;g<e.panel.fields.length;g++)f+=e.panel.fields[g]+(g!==e.panel.fields.length-1?",":"")}var h=e.panel.queries.basic_query+"&wt="+a+b+c+f,i=e.panel_request;i=i.setQuery(h);var j=i.doSearch();j.then(function(b){d.download_response(b,a,"fulltextsearch")})},e.populate_modal=function(b){e.inspector=a.toJson(JSON.parse(b.toString()),!0)},e.without_kibana=function(a){var b=c.clone(a);return delete b.kibana,b},e.set_refresh=function(a){e.refresh=a},e.close_edit=function(){e.refresh&&e.get_data(),e.refresh=!1},e.locate=function(a,b){b=b.split(".");for(var c=/(.+)\[(\d+)\]/,d=0;d<b.length;d++){var e=c.exec(b[d]);a=e?a[e[1]][parseInt(e[2],10)]:a[b[d]]}return a},e.set_facet_filter=function(a,b){i.set({type:"terms",field:a,value:b}),h.refresh()},e.filter_close=function(a){return i.idsByTypeAndField("terms",a).length>0},e.delete_filter=function(a,b){i.removeByTypeAndField(a,b),h.refresh()},$(".accordion").on("show hide",function(a){$(a.target).siblings(".accordion-heading").find(".accordion-toggle i").toggleClass("icon-chevron-up icon-chevron-down"),$(a.target).siblings(".accordion-heading").toggleClass("bold")})}]),f.filter("tableHighlight",function(){return function(a){if(!c.isUndefined(a)&&!c.isNull(a)&&a.toString().length>0){var b=a.toString().replace(/^\s*\n/gm,"<br>").replace(/<em>/g,'<span class="highlight-code"><b>').replace(/<\/em>/g,"</b></span>");return 0===b.lastIndexOf("<br>",0)?b.replace(/<br>/,""):b}return""}}),f.filter("tablebody",function(){return function(a){return!c.isUndefined(a)&&!c.isNull(a)&&a.toString().length>0?a.toString().replace(/^\s*\n/gm,"<br>"):""}}),f.filter("tableTruncate",function(){return function(a,b,d){return!c.isUndefined(a)&&!c.isNull(a)&&a.toString().length>0&&0!==b&&0!==d?a.length>b/d?a.substr(0,b/d)+"...":a:""}}),f.filter("tableJson",function(){var b;return function(d,e){return!c.isUndefined(d)&&!c.isNull(d)&&d.toString().length>0?(b=a.toJson(d,e>0?!0:!1),b=b.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),e>1&&(b=b.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(a){var b="number";return/^"/.test(a)?b=/:$/.test(a)?"key strong":"":/true|false/.test(a)?b="boolean":/null/.test(a)&&(b="null"),'<span class="'+b+'">'+a+"</span>"})),b):""}}),f.filter("tableFieldFormat",["fields",function(a){return function(b,d,f,g){var h;return c.isUndefined(a.mapping[f._index])||c.isUndefined(a.mapping[f._index][f._type])||(h=a.mapping[f._index][f._type][d].type,"date"!==h||!g.panel.normTimes)?b:e(b).format("YYYY-MM-DD HH:mm:ss")}}])});