import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

describe('renders content', () => {
  const likeArticle = jest.fn()
  const user = userEvent.setup()
  // const user = userEvent.setup()

  beforeEach(() => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      likes: 300,
      author: 'eee'
    }

    const onLikeArticle = () => { likeArticle() }

    render(<Blog blog={blog} onLikeArticle={onLikeArticle} />)
    // Assignment 1
  })

  test('renders basic text for blog, and QueryByText works', () => {
    const element = screen.getByText('Component testing is done with react-testing-library')
    expect(element).toBeDefined()

    const elementLike = screen.queryByText('likes: 300')
    expect(elementLike).toBeVisible()
  })

  test('authors are hidden by default', () => {
    const elementAuthor = screen.queryByText('eee', { exact: false })
    expect(elementAuthor).not.toBeVisible()
  })

  test('clicking on show details show likes', async () => {
    const button = screen.getByText('show details')
    await userEvent.click(button)
    const elementAuthor = screen.queryByText('eee', { exact: false })
    expect(elementAuthor).toBeVisible()
  })

  test('double click for double like registers', async () => {
    const button = screen.getByText('Like This')
    await user.click(button)
    await user.click(button)

    expect(likeArticle.mock.calls).toHaveLength(2)
  })

  test('forms submit', async () => {
    const submit = jest.fn().mockImplementation((e) => e.preventDefault())
    render(<BlogForm onSubmitBlog={submit} />)

    const content = screen.getByPlaceholderText('write blog content here')
    await userEvent.type(content, 'testing forms')

    const button = screen.getByText('save')
    await userEvent.click(button)

    expect(submit.mock.calls).toHaveLength(1)
    console.log(submit.mock.calls)
    expect(submit.mock.calls[0][1]).toBe('testing forms')
  })
})