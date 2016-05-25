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
  className: 'row',
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
    var $html = $('<select id="invoiceSelector"></select>');
    _.each(this.collection.models, function(model, index){
      $html.append(_me.getModelEl(model, index));
    });
    $html.appendTo($(this.el));
    this.stickit();
    return this;
  },
  getModelEl:function(model, index){
    var html = '<option value="'+ index +'">'+ model.get('description') || 'New Description' +'</option>';
    return html;
  },
  onSelectorChange:function(e){
    var value = $("#invoiceSelector").val();
    this.model.set("index", value);
  },
  bindings: {
    'select': {
      observe: 'index'
    }
  },
  events:{
    'change select#invoiceSelector':'onSelectorChange'
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

var InvoiceView = Backbone.View.extend({
  // model: Backbone.Model.extend({
  //   selectedItem: 0
  // }),
  className: 'panel panel-default',
  events: {
    'click #invoice-head button.btn':'addNewInvoiceItem'
  }
  onInvoiceSelectorChanged:function(model){
    var index = model.get('index');
    var theirModel = this.invoiceSelectorView.collection.models[index];
    this.invoiceItemView.model.set(theirModel.toJSON());
  },
  addNewInvoiceItem:function(){

  },
  initialize: function(){
    var html = $("#invoice-template").html();
    this.el.innerHTML = html;
    this.invoiceSelectorView = new InvoiceSelectorView({collection: invoiceItemCollection, model: invoiceSelectorModel});
    this.invoiceItemView = new InvoiceItemView({model: invoiceItemModel});
    this.invoiceItemFormView = new InvoiceItemFormView({model: invoiceItemModel});

    this.invoiceSelectorView.model.on('change:index', this.onInvoiceSelectorChanged, this);
  },
  render: function(){
    var _me = this;
    this.$el = $(this.el);
    this.$el.find("#invoice-head").append(_me.invoiceSelectorView.render().el).find('.row').append('<button type="button" class="btn btn-primary">Add</button>');
    this.$el.find("#invoice-body").append(_me.invoiceItemFormView.render().el);
    this.$el.find("#invoice-footer").append(_me.invoiceItemView.render().el);
    $('#content').append(_me.el);
    return this;
  }
});

$(function(){
  new InvoiceView({model: Backbone.Model.extend({})}).render();
});
