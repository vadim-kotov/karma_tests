## Unit-тесты Requality

[Requality](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/contributing/testing-environment.html) - инструмент для создания требований и манипуляции над требованиями. Разрабатывается в Инструтите системного программирования РАН.

Была сконфигурирована среда модульного тестирования JS-редактора требований, подобная среде тестирования [CKEditor'a](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/contributing/testing-environment.html). В ней был разработан набор тестов.

Пути в проекте предполагают, что репозиторий находится в директории [jstools](https://forge.ispras.ru/projects/reqdb/repository/requality/revisions/master/show/jstools).

### Инструменты

Karma - test-runner\
Тестовые фреймворки Mocha, Chai\
Sinon - mock-библиотека\
Istanbul - покрытие

### Установка необходимых пакетов: 
npm install -g karma-cli  
npm i  
### Запуск тестов:
npm test
