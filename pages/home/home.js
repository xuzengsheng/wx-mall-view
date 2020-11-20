// pages/home/home.js
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');
var sectionData = [];
var ifLoadMore = null;
var page = 1;//默认第一页
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbars:null,
    currentTab: 0,
    banners:null,
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    menus: null,
    brands: null,
    hidden:false,

  },
  // 导航切换监听
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //加载navbar导航条
    that.navbarShow();
    //加载banner轮播
    that.bannerShow();
    //加载menu分类导航菜单
    that.menuShow();
    //加载新品特卖
    that.brandShow();
    
    //加载福利专场
    that.newGoodsShow();
  },
  navbarShow:function(success){
    var that = this;
    ajax.request({
      method: 'GET',
      // url: 'home/navBar?key=' + utils.key,
      url: '/navbarInfo/initNavBar',
      success: data => {
        that.setData({
          navbars: data
        })
        console.log("navbarShow:" + JSON.stringify(data))
      }
    })
  },
  bannerShow: function (success) {
    var that = this;
    ajax.request({
      method: 'GET',
      // url: 'home/banners?key=' + utils.key,
      url: '/bannerInfo/initBannerList',
      success: data => {
        that.setData({
          banners: data
        })
        console.log("bannerShow:" + JSON.stringify(data))
      }
    })
  },
  menuShow: function (success) {
    var that = this;
    ajax.request({
      method: 'GET',
      // url: 'home/menus?key='+ utils.key,
      url: '/menuInfo/initMenu',
      success: data => {
        console.log("menuShow:"+ JSON.stringify(data))
        that.setData({
          menus: data
        })
      }
    })
  },
  brandShow: function (success) {
    var that = this;
    ajax.request({
      method: 'GET',
      // url: 'activity/brands?key='+utils.key+'&type=temai&page=1&size=5',
      url: '/brandInfo/initBrand',
      success: data => {
        console.log("brandShow:" + JSON.stringify(data))
        that.setData({
          brands: data
        })
        
      }
    })
  },
  newGoodsShow: function (success) {
    var that = this;
    ajax.request({
      method: 'GET',
      // url: 'goods/getHotGoodsList?key='+ utils.key+'&page=' + page+'&size=10',
      url: '/goodsInfo/initGoods',
      success: data => {
        console.log("newGoodsShow:"+JSON.stringify(data))
        var newGoodsData = data;
        page += 1;
        if (ifLoadMore) {
          //加载更多
          if (newGoodsData.length > 0){
            console.log(newGoodsData)
            //日期以及title长度处理
            for (var i in newGoodsData) {
              //商品名称长度处理
              var name = newGoodsData[i].name;
              if (name.length > 26) {
                newGoodsData[i].name = name.substring(0, 23) + '...';
              }
            }
            sectionData['newGoods'] = sectionData['newGoods'].concat(newGoodsData);

          }else{
              ifLoadMore = false;
              this.setData({
                hidden:true
              })
              wx.showToast({
                title: '暂无更多内容！',
                icon: 'loading',
                duration: 2000
              })
          }
          
        }else{
          if (ifLoadMore == null){
            ifLoadMore = true;

            //日期以及title长度处理
            for (var i in newGoodsData) {
              //商品名称长度处理
              var name = newGoodsData[i].name;
              if (name.length > 26) {
                newGoodsData[i].name = name.substring(0, 23) + '...';
              }
            }
            sectionData['newGoods'] = newGoodsData;//刷新
          }
          
        }
        that.setData({
          newGoods: sectionData['newGoods'],
          // isHideLoadMore: true
        });
        wx.stopPullDownRefresh();//结束动画
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉");
    var that = this;
    console.log('加载更多');
    if (ifLoadMore != null){
      that.newGoodsShow();

    }
  },
  /**
   * 点击轮播图事件
   * @param {*} e 
   */
  bannerClick: function (e) {
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    console.log('goodsId:' + goodsId);
    //新增商品用户点击数量
    that.goodsClickShow(goodsId);
    //跳转商品详情
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },
  catchTapCategory: function (e) {
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    console.log('goodsId:' + goodsId);
    //新增商品用户点击数量
    that.goodsClickShow(goodsId);
    //跳转商品详情
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })
  },
  goodsClickShow(goodsId) {
    console.log('增加商品用户点击数量');
    var that = this;
    ajax.request({
      method: 'GET',
      // url: 'goods/addGoodsClickRate?key=' + utils.key + '&goodsId=' + goodsId,
      url: '/goodsInfo/updateClickRate?id='+goodsId,
      success: data => {
        console.log("用户点击统计返回结果：" + data.message)
      }
    })
  },
})