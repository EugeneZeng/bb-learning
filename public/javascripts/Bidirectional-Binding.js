//Bidirectional-Binding.js
var InvoiceItemModel = Backbone.Model.extend({});
var InvoiceItemCollection = Backbone.Collection.extend({
  model: InvoiceItemModel
});
var InvoiceItemFormView = Backbone.View.extend({
  className: 'row',
  bindings: {
    '#description':{observe: 'description'},
    '#price':{
      observe: 'price',
      onGet: 'priceGetter',
      onSet: 'priceSetter'
    },
    '#quantity':{observe: 'quantity'}
  },
  priceGetter: function(val, opt){
    return '$'+val;
  },
  priceSetter: function(val, opt){
    return Number(val.replace(/[^0-9\.]+/g, ''));
  },
  render: function(){
    var html = $("#form-template").html();
    $(this.el).html(html);
    this.stickit();
    return this;
  }
});
var InvoiceItemView = Backbone.View.extend({
  className: 'row bg-primary',
  bindings: {
    '#description':'description',
    '#price':{
      observe: 'price',
      update: 'doUpdate',
      afterUpdate: 'hightlight'
    },
    '#quantity':'quantity'
  },
  doUpdate: function($el, val, model, opt){
    $el.text(val);
  },
  hightlight: function($el, val, model, opt){
    $el.animate({backgroundColor:'red'}, 'fast')
      .animate({backgroundColor: 'white'}, 'fast');
  },
  render: function(){
    var html = $("#item-template").html();
    $(this.el).html(html);
    this.stickit();
    return this;
  }
});
var InvoiceSelectorModel = Backbone.Model.extend({});
var InvoiceSelectorView = Backbone.View.extend({
  className:'row',
  render: function(){
    var _me = this;
    var $html = $('<select></select>');
    _.each(this.collection.models, function(model, index){
      $html.append(_me.getModelEl(model, index));
    });
    $html.appendTo($(this.el));
    this.stickit();
    return this;
  },
  getModelEl:function(model, index){
    var html = '<option value="'+ index +'">'+ model.get('description') +'</option>';
    return html;
  },
  bindings: {
    'select': {
      observe: 'index'
    }
  }
});
var invoiceItemModel = new InvoiceItemModel({
  description: 'Eugene Zeng Invoice',
  price: 22,
  quantity: 3
});
var invoiceSelectorModel = new InvoiceSelectorModel({
  index: 0
});

var invoiceItemCollection = new InvoiceItemCollection([
  { description: 'Wooden Toy House', price: 22, quantity: 3 },
  { description: 'Farm Animal Set', price: 17, quantity: 2 },
  { description: 'Farmer Figure', price: 8, quantity: 4 },
  { description: 'Toy Tractor', price: 15, quantity: 6 }
]);
$(function(){
  $('#content')
    .append(new InvoiceSelectorView({collection: invoiceItemCollection, model: invoiceSelectorModel}).render().el)
    .append(new InvoiceItemView({model: invoiceItemModel}).render().el)
    .append(new InvoiceItemFormView({model: invoiceItemModel}).render().el);
});
