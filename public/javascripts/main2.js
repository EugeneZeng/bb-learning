var data = [
  {
    id:"iv001",
    Price:25,
    Description:"Eugene's Invoice",
    Quantity:3
  },
  {
    id:"iv002",
    Price:22,
    Description:"Serena's Invoice",
    Quantity:2
  },
  {
    id:"iv003",
    Price:12,
    Description:"Mike's Invoice",
    Quantity:5
  },
  {
    id:"iv004",
    Price:13,
    Description:"Allen's Invoice",
    Quantity:4
  },
  {
    id:"iv005",
    Price:13,
    Description:"Aliang's Hotel live",
    Quantity:13
  }
];
var InvoiceCollection = Backbone.Collection.extend({
  findById: function(id){
    return this.find(function(model){
      return model.get("id") === id
    });
  },
  deleteById:function(id){
    var targetModel = this.findById(id);
    this.remove(targetModel);
  }
});
var InvoiceItemView = Marionette.ItemView.extend({
  tagName: "tr",
  template: "#item-template",
  ui: {
    "edit":".btn-default"
  },
  events:{
    "click @ui.edit":"itemEdit"
  },
  initialize:function(){
    this.model.on("change", this.render);
  },
  itemEdit:function(){
    var _self = this;
    var editView = new EmptyInvoiceItemView({
      onSubmit:function(){
        var json = _self.model.toJSON();
        _.extend(json, this.model.toJSON());
        _self.model.set(json);
        _self.$el.show();
      },
      onCancel:function(){
        _self.$el.show();
      },
      initData: _self.model.toJSON()
    });
    this.$el.hide().after(editView.render().el);
  }
});
var EmptyInvoiceItemView = Marionette.ItemView.extend({
  tagName: "tr",
  template: "#empty-item-template",
  ui: {
    "OK":".btn-success",
    "Cancel":".btn-default"
  },
  events:{
    "click @ui.OK":"doSubmit",
    "click @ui.Cancel":"doCancel",
    "change":"doChange"
  },
  initialize: function(options){
    if(options.initData){
      this.model = new Backbone.Model(options.initData);
    } else {
      this.model = new Backbone.Model({
        Price:0,
        Description:"",
        Quantity:0
      });
    }
    if(options.onSubmit){
      this.onSubmit = options.onSubmit;
    }
    if(options.onCancel){
      this.onCancel = options.onCancel;
    }
  },
  doSubmit:function(){
    if(this.onSubmit){
      this.onSubmit.apply(this);
    }
    this.close();
  },
  doCancel:function(){
    if(this.onCancel){
      this.onCancel.apply(this);
    }
    this.close();
  },
  doChange:function(e){
    var $target = $(e.target);
    var name = $target.attr("name");
    var value = $target.val();
    this.model.set(name, value);
  }
});
var InvoicePanelView = Marionette.CompositeView.extend({
  itemView: InvoiceItemView,
  itemViewContainer: "tbody",
  template: "#panel-template",
  ui: {
    "delete":".btn-danger"
  },
  events:{
    "click @ui.delete":"itemDelete"
  },
  // collectionEvents:{
  //   "remove":"removeItem"
  // },
  show:function(){
    $("#content").append(this.el);
  },
  itemDelete:function(e){
    var id = $(e.currentTarget).attr("data-id");
    this.collection.deleteById(id);
  }
});

(function($){
  $(function(){
    var invoices = new InvoicePanelView({
      model: new Backbone.Model({
        title: "All Invoices"
      }),
      collection: new InvoiceCollection(data)
    });
    invoices.render().show();
  });
})(jQuery)