(function () {

    angular.module('restApp')
        .constant('constant', {
            serviceBase: '/rest.php/',
            resourcesQuery: 'resources',
            searchQuery: 'searches',
            resource_classesQuery: 'resource_classes',
            parametersQuery: 'parameters',
            operationsQuery: 'operations',
            personal_datasQuery: 'personal_datas',
            paramsNumber: 6,
            perPage: 4,
            pageRange: 7,
            ownerDataFields:6,
            TIME_DIFF : 24*60*60*1000,
            MSEC_IN_MIN : 60000,
            MSEC_IN_SEC : 1000,
            DEFOULT_START_DATE : new Date(),
            DEFOULT_MIN_DATE : new Date(0),
            DEFAULT_MIN_SEARCH_OWNER_DATA:3,
            DEFAULT_MIN_SEARCH_OWNER_DATA_CREATE:1,
            DAY_CHAR_START:0,
            DAY_CHAR_END:10,
            SQUARE_ID:4,
            METERS_IN_HECTARE:10000,
            MSG_TO_FILL_TYPE_OPERATION : 'Виберіть будь ласка хоча б один тип операцій для перегляду подій',
            MSG_LOAD_USER:'Ви дійсно бажаєте вибрати дану особу як користувача ресурсу ?',
            MSG_SEARCH_OWNER_MIN_REQ:'Виберіть для пошуку щонайменше полів',
            MSG_DELATE_RESOURCE: 'Ви дійсно бажаєте видалити цей ресурс ?',
            MSG_DELETE_RESOURCE_OWNER:'Ви дійсно бажаєте вилучити цю особу як користувача даного ресурсу ?',
            MSG_SELECT_CLASS:'Оберіть класс',
            MSG_REGISTRATION_SUCCESSFULLY:'Реєстрація пройшла успішно!',
            MSG_REQUEST_UPDATE_OWNER_DATA_ERROR:'не вдалось обновити дані користувача ресурсу, обновіть сторінку і спробуйте знову',
            reasonWatchGroupHash : [
                "owner.passport_series",
                "owner.passport_number",
                "owner.first_name",
                "owner.last_name",
                "owner.middle_name",
                "reason.passport.department",
                "reason.passport.date",
            ],
            MSG_REASON_DOC_PSW:'паспорт громадянина України',
            MSG_REASON_DOC_DEPARTMENT:'виданий на ім\'я'

        });
})();
