import test from 'ava'
import request from 'supertest-as-promised'
import mockgoose from 'mockgoose'
import { masterKey } from '../../config'
import express from '../../config/express'
import mongoose from '../../config/mongoose'
import routes, { Article } from '.'

const app = () => express(routes)

test.before(async (t) => {
  await mockgoose(mongoose)
  await mongoose.connect('')
})

test.beforeEach(async (t) => {
  const article = await Article.create({})
  t.context = { ...t.context, masterKey, article }
})

test.afterEach.always(async (t) => {
  await Article.remove()
})

test.serial('POST /articles 201 (master)', async (t) => {
  const { masterKey } = t.context
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: masterKey, tite: 'test', content: 'test', arthur: 'test' })
  t.true(status === 201)
  t.true(typeof body === 'object')
  t.true(body.tite === 'test')
  t.true(body.content === 'test')
  t.true(body.arthur === 'test')
})

test.serial('POST /articles 401 (admin)', async (t) => {
  const { adminSession } = t.context
  const { status } = await request(app())
    .post('/')
    .send({ access_token: adminSession })
  t.true(status === 401)
})

test.serial('POST /articles 401 (user)', async (t) => {
  const { userSession } = t.context
  const { status } = await request(app())
    .post('/')
    .send({ access_token: userSession })
  t.true(status === 401)
})

test.serial('POST /articles 401', async (t) => {
  const { status } = await request(app())
    .post('/')
  t.true(status === 401)
})

test.serial('GET /articles 200', async (t) => {
  const { status, body } = await request(app())
    .get('/')
  t.true(status === 200)
  t.true(Array.isArray(body))
})

test.serial('GET /articles/:id 200', async (t) => {
  const { article } = t.context
  const { status, body } = await request(app())
    .get(`/${article.id}`)
  t.true(status === 200)
  t.true(typeof body === 'object')
  t.true(body.id === article.id)
})

test.serial('GET /articles/:id 404', async (t) => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  t.true(status === 404)
})

test.serial('PUT /articles/:id 200 (master)', async (t) => {
  const { masterKey, article } = t.context
  const { status, body } = await request(app())
    .put(`/${article.id}`)
    .send({ access_token: masterKey, tite: 'test', content: 'test', arthur: 'test' })
  t.true(status === 200)
  t.true(typeof body === 'object')
  t.true(body.id === article.id)
  t.true(body.tite === 'test')
  t.true(body.content === 'test')
  t.true(body.arthur === 'test')
})

test.serial('PUT /articles/:id 401 (admin)', async (t) => {
  const { adminSession, article } = t.context
  const { status } = await request(app())
    .put(`/${article.id}`)
    .send({ access_token: adminSession })
  t.true(status === 401)
})

test.serial('PUT /articles/:id 401 (user)', async (t) => {
  const { userSession, article } = t.context
  const { status } = await request(app())
    .put(`/${article.id}`)
    .send({ access_token: userSession })
  t.true(status === 401)
})

test.serial('PUT /articles/:id 401', async (t) => {
  const { article } = t.context
  const { status } = await request(app())
    .put(`/${article.id}`)
  t.true(status === 401)
})

test.serial('PUT /articles/:id 404 (master)', async (t) => {
  const { masterKey } = t.context
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: masterKey, tite: 'test', content: 'test', arthur: 'test' })
  t.true(status === 404)
})

test.serial('DELETE /articles/:id 204 (master)', async (t) => {
  const { masterKey, article } = t.context
  const { status } = await request(app())
    .delete(`/${article.id}`)
    .query({ access_token: masterKey })
  t.true(status === 204)
})

test.serial('DELETE /articles/:id 401 (admin)', async (t) => {
  const { adminSession, article } = t.context
  const { status } = await request(app())
    .delete(`/${article.id}`)
    .query({ access_token: adminSession })
  t.true(status === 401)
})

test.serial('DELETE /articles/:id 401 (user)', async (t) => {
  const { userSession, article } = t.context
  const { status } = await request(app())
    .delete(`/${article.id}`)
    .query({ access_token: userSession })
  t.true(status === 401)
})

test.serial('DELETE /articles/:id 401', async (t) => {
  const { article } = t.context
  const { status } = await request(app())
    .delete(`/${article.id}`)
  t.true(status === 401)
})

test.serial('DELETE /articles/:id 404 (master)', async (t) => {
  const { masterKey } = t.context
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: masterKey })
  t.true(status === 404)
})
