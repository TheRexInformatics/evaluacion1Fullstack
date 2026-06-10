import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Sidebar from '../Sidebar'

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    render(<Sidebar activeSection="Dashboard" />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Inventario')).toBeInTheDocument()
    expect(screen.getByText('Pedidos')).toBeInTheDocument()
    expect(screen.getByText('Envíos')).toBeInTheDocument()
  })

  it('highlights the active section', () => {
    render(<Sidebar activeSection="Pedidos" />)
    const pedidosBtn = screen.getByText('Pedidos').closest('button')
    expect(pedidosBtn).toHaveClass('bg-blue-600')
  })

  it('does not highlight inactive sections', () => {
    render(<Sidebar activeSection="Dashboard" />)
    const pedidosBtn = screen.getByText('Pedidos').closest('button')
    expect(pedidosBtn).not.toHaveClass('bg-blue-600')
  })

  it('renders SmartLogix branding', () => {
    render(<Sidebar activeSection="Dashboard" />)
    expect(screen.getByText('Logix')).toBeInTheDocument()
  })
})
