#!/usr/bin/env node
const i3 = require('i3').createClient()
const inspect = require('util').inspect


function filter_tree(node, fn, resa = []) {
  for (var n of (node.nodes || []))
    filter_tree(n, fn, resa)
  if (!!fn(node))
    resa.push(node)
  return resa
}

function goto_nth(nth) {
  i3.workspaces(function (err, reply) {
    const workspaces = reply.filter(w => w.visible).sort((a, b) => a.rect.x > b.rect.x ? 1 : a.rect.x < b.rect.x ? -1 : 0)
    i3.tree((err, rep) => {
      // console.log(inspect(rep, false, null, true))
      var selected_w = workspaces.map(work => filter_tree(rep, n => n.name === work.name && n.type === 'workspace')[0])
      // console.log(selected_w)
      var res = [] // cons
      for (var w of selected_w) {
        res = [...res, ...filter_tree(w, w => w.nodes.length === 0 && w.type === 'con')]
      }
      // console.log(res[nth])
      if (res[nth]) {
        i3.command(`[con_id=${res[nth].id}] focus`, function () {
          // console.log(arguments)
          // process.exit(0)
        })
      }
      // var res = filter_tree(reply, n => n.nodes.length === 0 && n.type === 'con')
    })
    // console.log(inspect(workspaces, false, null, true))
  })
}


i3.on('binding', function (ev) {
  const b = ev.binding
  // console.log(ev)
  console.log(b.symbol)
  // console.log(b.command)
  if (b.command === 'nop switch') {
    var nth = parseInt(b.symbol)
    goto_nth(nth - 1)
  }
  // console.log(arguments)
})

// i3.tree(function (err, reply) {
//   // console.log(reply)
//   console.log(inspect(reply, false, null, true))
//   // console.log(res.map(r => { return {name: r.name, type: r.type }}))
//   console.log(res)
// })

// i3.command(`[con_id=${id}] focus`)

i3.on('tree', function () {
  console.log(arguments)
})