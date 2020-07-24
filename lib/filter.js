const match = require('minimatch')

module.exports =  (filters) => {  return (files, metalsmith, done) => {    filter(files, filters, metalsmith.metadata(), done)  }}
function filter (files, filters, data, done) {
  // 如果没有定义filters，直接执行done  
  if (!filters) return done()
  //获取filters数组定义的路径key并遍历  
  Object.keys(filters).forEach(key => {
    Object.keys(files).forEach(file => {
      // 如果files的路径key和配置文件中定义的路径key值匹配 
      if (match(file, key, { dot: true })) {
        const condition = filters[key]
        if(!evaluate(condition, data)){
          delete files[file]
        }
      }
    })
  })
  done()
}

function evaluate (condition, data){
  let str = condition
  Object.keys(data).forEach(key => {
    var reg=new RegExp(key, 'g');
    data[key] = `'${data[key]}'`
    condition = condition.replace(reg, data[key])
  })
  return eval(condition)
}