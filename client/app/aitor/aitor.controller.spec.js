'use strict';

describe('Controller: AitorCtrl', function () {

  // load the controller's module
  beforeEach(module('killmenos9App'));

  var AitorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AitorCtrl = $controller('AitorCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
