'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '../products/data-table'
import { columns } from './columns'
import { getAllProducts } from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@/types'
import ProductSheet from './product-sheet'
import CreateProductForm from './create-product-form'
import { useNewProductStore } from '@/store/product/product-store'
import { Loader2 } from 'lucide-react'


const page = () => {

  const { onOpen } = useNewProductStore()

  const { data: products, isLoading,isError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getAllProducts
  })


  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Products</h3>
        <Button
          onClick={() => onOpen()}
          size={'sm'} >Add Product</Button>
        <ProductSheet />
      </div>

      {
        isError  && <div className="text-red-500">Error fetching data</div>
      }

      {
        isLoading ? (<div className='flex flex-center justify-center'>
          <Loader2 className="size-10 animate-spin" />
        </div>) : (<DataTable
          columns={columns}
          data={products || []}
        />)
      }
    </>

  )
}

export default page