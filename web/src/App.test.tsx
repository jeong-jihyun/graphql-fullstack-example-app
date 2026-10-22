import React from "react"
import { screen } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing"
import { MemoryRouter } from "react-router-dom"
import { render } from "./test-utils"
import Login from "./pages/Login"

// 서버 없이 확인할 수 있는 로그인 화면만 검사한다.
test("로그인 화면에 제목과 입력칸이 나온다", async () => {
  render(
    <MockedProvider mocks={[]}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </MockedProvider>
  )
  expect(await screen.findByText("지브리 명장면 프로젝트")).toBeInTheDocument()
  expect(screen.getByText("이메일 또는 아이디")).toBeInTheDocument()
  expect(screen.getByPlaceholderText("이메일 또는 아이디를 입력하세요")).toBeInTheDocument()
})
