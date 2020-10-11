'use strict';

/**
 * Config constant
 */
app.constant('APP_MEDIAQUERY', {
    'desktopXL': 1200,
    'desktop': 992,
    'tablet': 768,
    'mobile': 480
});

app.constant('CASE_TYPE_INFO',{
    'Employment' : ['If you feel you have been the victim of an Unfair Dismissal, Constructive Dismissal, Discrimination \
    or any other Employment Law issue, allow LawBid help you get the right employment lawyer.\
    Redundancy rights of employees must be carefully observed by their employer. Redundancies must be carried out in \
    accordance with the law in order to entitle a redundancy payment otherwise an employee can claim for unfair dismissal\
     and compensation.','Please provide as much detail as possible about the matter in order for there to be an accurate' +
    ' assessment of your case and a speedy response from the most suitable legal professionals.'],

    'Immigration' : ['Given the complex and rapidly changing nature of immigration policies and the potentially life ' +
    'changing effects of making an unsuccessful visa application, it’s imperative that your matter is handled by a' +
    ' qualified, regulated and knowledgeable solicitor who can achieve the desired result upon first application.' +
    '  You may require advice for Visa Refusals, Administrative and Judicial Reviews, New Applications, Work, study' +
    ' or family Visas or British Citizenship.'],

    'PersonalInjury' : ['Personal Injury solicitors are experts at ensuring you get the best service and maximum ' +
    'compensation following an accident.', 'Our no-win, no- fee personal injury solicitors will consider your claim ' +
    'and advise whether you have a have a viable personal injury claim. ', 'If you have suffered from medical \
    negligence and you think your GP, dentist or hospital is at fault, you may be able to claim compensation through \
    legal action.', 'Claims can be made for death or serious disability, injury resulting from medical error or ' +
    'misjudgement or less serious problems for example losing a tooth through dental treatment error. ', 'Depending on ' +
    'your situation, you and your family may be able to obtain compensation for suffering, pain, loss of earnings and ' +
    'the cost of care, housing and social needs, for now and the future.', 'Please provide as much detail as possible ' +
    'about the matter in order for there to be an accurate assessment of your case and a speedy response from the most ' +
    'suitable legal professionals.'],

    'Litigation' : ['When two or more parties become embroiled in a legal dispute seeking money or another specific' +
    ' performance rather than criminal sanctions, civil litigation is the result. They must instead head to the ' +
    'courtroom for trial so a judge or jury can decide the matter. We can help you find the right litigation solicitor ' +
    'for your individual requirements. ', 'Before entering into any form of litigation it is vitally important to find' +
    ' a solicitor with expertise in commercial litigation in your You may require advice on partnership disputes and ' +
    'partnership litigation subjects, Commercial litigation law relating to professional negligence, property litigation' +
    ' such as, assisting with property disputes, transferences and conveyances or Insolvency advice such as, presenting' +
    ' of statutory demands, presenting and defending, winding up petitions and advising on company voluntary arrangements '],

    'Property' : ['Buying or selling a property is a complex process and as it involves an asset of considerable worth, ' +
    'so it is advisable to contact a specialist property solicitor to assist you with the transaction. Legal property ' +
    'law advice is recommended for both commercial and residential transactions. '],

    'TaxServices' : ['UK tax law governs the whole range of taxes applying to individuals, businesses, goods, services, \
    and assets. Tax law affects everyone, and using a specialist tax law solicitor could benefit your finances hugely.'],

    'WillsAndProbate' : ['Wills and probate solicitors can provide you with advice on all matters including Will' +
    ' writing, Executor services, Probate law, Trusts and contested probate', 'Elect a wills and probate solicitor ' +
    'to execute your will or, if you have been nominated as executor of another person\'s will , a wills and probate ' +
    'solicitor can help you understand your obligations.'],

    'BusinessMatters' : ['Intellectual Property (IP) is a way of protecting your business’ property and assets. There \
    are many different forms of IP, both formal and informal, that can be used to protect an idea, and will allow you \
    to commercially exploit it. Consider appointing a specialist lawyer in this area to ensure you get the right \
    protection for your business.'],

    'CrimeOrMottoringOffences' : ['Whether you have a case relating to general crime, serious fraud, financial services \
    investigations, offences under the Bribery Act, money laundering, internal and corporate investigations and health \
    and safety investigations, our specialist solicitors can help.', 'If you are being prosecuted for an alleged \
    motoring offence and are in any doubt as to what you should do we recommend that you seek legal advice from a \
    suitably qualified expert.'],

    'Family' : ['Many people, at some point in their lives will have some form of family law issue. Whether it is a \
    divorce, separation, problems involving an ex-partner or gaining access to your children finding the answers to \
    these situations and what your legal rights are can be tricky', 'When facing divorce, separation, domestic abuse \
    or other family difficulties, the right advice and support is essential from skilled professionals who are \
    experienced at resolving the kind of disputes that arise when couples separate.'],

    'Debt' : ['Taking debt recovery action can be a costly and time-consuming process. Before taking legal action to \
    recover an unpaid debt, you should consider whether the cost of pursuing the debt outweighs its value, whether the \
    debtor is likely to be able to pay the debt and associated recovery costs, and whether it will be possible to \
    enforce a court judgement. For example, there is nothing to be gained by appointing bailiffs when the firm has \
    no assets to seize.', 'Before taking recovery action, you should make every effort to recover debts through \
    negotiation with your customer. However, if this is not successful there are several options you can take.'],

    'Corporate' : ['The practice of corporate law involves general corporate matters, such as the incorporation of \
    companies, directors’ and shareholders’ rights, articles of association, board meetings, secretarial matters and \
    the public listing or delisting of companies.', 'No two corporate transactions or deals are the same. \
    The differences can depend upon several factors, such as the type of industry, whether it involves single or \
    multimarket businesses, and the size of the companies involved.']

});
app.constant('JS_REQUIRES', {
    //*** Scripts
    scripts: {
        //*** Javascript Plugins
        'd3': '../../bower_components/d3/d3.min.js',

        //*** jQuery Plugins
        'chartjs': '../../bower_components/chartjs/Chart.min.js',
        'ckeditor-plugin': '../../bower_components/ckeditor/ckeditor.js',
        'jquery-nestable-plugin': ['../../bower_components/jquery-nestable/jquery.nestable.js'],
        'touchspin-plugin': ['../../bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js', '../../bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],
        'jquery-appear-plugin': ['../../bower_components/jquery-appear/build/jquery.appear.min.js'],
        'spectrum-plugin': ['../../bower_components/spectrum/spectrum.js', '../../bower_components/spectrum/spectrum.css'],

        //*** Controllers
        'dashboardCtrl': 'assets/js/controllers/dashboardCtrl.js',
        'iconsCtrl': 'assets/js/controllers/iconsCtrl.js',
        'vAccordionCtrl': 'assets/js/controllers/vAccordionCtrl.js',
        'laddaCtrl': 'assets/js/controllers/laddaCtrl.js',
        'ngTableCtrl': 'assets/js/controllers/ngTableCtrl.js',
        'cropCtrl': 'assets/js/controllers/cropCtrl.js',
        'asideCtrl': 'assets/js/controllers/asideCtrl.js',
        'toasterCtrl': 'assets/js/controllers/toasterCtrl.js',
        'sweetAlertCtrl': 'assets/js/controllers/sweetAlertCtrl.js',
        'mapsCtrl': 'assets/js/controllers/mapsCtrl.js',
        'calendarCtrl': 'assets/js/controllers/calendarCtrl.js',
        'nestableCtrl': 'assets/js/controllers/nestableCtrl.js',
        'validationCtrl': ['assets/js/controllers/validationCtrl.js'],
        'userCtrl': ['assets/js/controllers/userCtrl.js'],
        'PostCtrl': 'assets/js/controllers/postCtrl.js',
        'uploadCtrl': 'assets/js/controllers/uploadCtrl.js',
        'xeditableCtrl': 'assets/js/controllers/xeditableCtrl.js',
        'notificationIconsCtrl': 'assets/js/controllers/notificationIconsCtrl.js',
        'notifyCtrl': 'assets/js/controllers/notifyCtrl.js',
        'knobCtrl': 'assets/js/controllers/knobCtrl.js',
    },
    //*** angularJS Modules
    modules: [{
        name: 'toaster',
        files: ['../../bower_components/AngularJS-Toaster/toaster.js', '../../bower_components/AngularJS-Toaster/toaster.css']
    }, {
        name: 'angularBootstrapNavTree',
        files: ['../../bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js', '../../bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css']
    }, {
        name: 'ngTable',
        files: ['../../bower_components/ng-table/dist/ng-table.min.js', '../../bower_components/ng-table/dist/ng-table.min.css']
    }, {
        name: 'ui.mask',
        files: ['../../bower_components/angular-ui-utils/mask.min.js']
    }, {
        name: 'ngImgCrop',
        files: ['../../bower_components/ngImgCrop/compile/minified/ng-img-crop.js', '../../bower_components/ngImgCrop/compile/minified/ng-img-crop.css']
    }, {
        name: 'angularFileUpload',
        files: ['../../bower_components/angular-file-upload/angular-file-upload.min.js']
    }, {
        name: 'monospaced.elastic',
        files: ['../../bower_components/angular-elastic/elastic.js']
    }, {
        name: 'ngMap',
        files: ['../../bower_components/ngmap/build/scripts/ng-map.min.js']
    }, {
        name: 'chart.js',
        files: ['../..//bower_components/angular-chart.js/dist/angular-chart.min.js', '../..//bower_components/angular-chart.js/dist/angular-chart.min.css']
    }, {
        name: 'flow',
        files: ['../../bower_components/ng-flow/dist/ng-flow-standalone.min.js']
    }, {
        name: 'ckeditor',
        files: ['../../bower_components/angular-ckeditor/angular-ckeditor.min.js']
    }, {
        name: 'mwl.calendar',
        files: ['../../bower_components/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js', '../../bower_components/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css', 'assets/js/config/config-calendar.js']
    }, {
        name: 'ng-nestable',
        files: ['../../bower_components/ng-nestable/src/angular-nestable.js']
    }, {
        name: 'ngNotify',
        files: ['../../bower_components/ng-notify/dist/ng-notify.min.js', '../../bower_components/ng-notify/dist/ng-notify.min.css']
    }, {
        name: 'xeditable',
        files: ['../../bower_components/angular-xeditable/dist/js/xeditable.min.js', '../../bower_components/angular-xeditable/dist/css/xeditable.css', 'assets/js/config/config-xeditable.js']
    }, {
        name: 'checklist-model',
        files: ['../../bower_components/checklist-model/checklist-model.js']
    }, {
        name: 'ui.knob',
        files: ['../../bower_components/ng-knob/dist/ng-knob.min.js']
    }, {
        name: 'ngAppear',
        files: ['../../bower_components/angular-appear/build/angular-appear.min.js']
    }, {
        name: 'countTo',
        files: ['../../bower_components/angular-count-to-0.1.1/dist/angular-filter-count-to.min.js']
    }, {
        name: 'angularSpectrumColorpicker',
        files: ['../../bower_components/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.min.js']
    }]
});
