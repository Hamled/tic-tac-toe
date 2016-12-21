import $ from 'jquery';
import ApplicationView from 'app/views/application_view';

$(function() {
  const appView = new ApplicationView({
    el: '#application'
  });

  appView.render();
});
