import React, { use } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet'
import CreateProductForm ,{ FormValues }  from './create-product-form'
import { CreateProduct } from '@/http/api'
import { useMutation,useQueryClient } from '@tanstack/react-query'
import {useNewProductStore} from '@/store/product/product-store'



const ProductSheet = () => {

    const {onClose,isOpen,open} =useNewProductStore()

    const queryClient = useQueryClient();

    const {mutate} = useMutation({
        mutationKey:[ 'create-product'],
        mutationFn: (data: FormData) => CreateProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']})
            alert('Product created')
        }
    })

    const OnSubmit =(values:FormValues ) =>{
        console.log('submit', values)
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', String(values.price));
        formData.append('image', (values.image as FileList)[0]);

        mutate(formData)
    }


    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            {/* <SheetTrigger>Open</SheetTrigger> */}
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create Product </SheetTitle>
                    <SheetDescription>
                        create a new product
                    </SheetDescription>
                </SheetHeader>
                <h1>Create product from</h1>
                <CreateProductForm onSubmit={
                    OnSubmit
                } disabled={false} />
            </SheetContent>
        </Sheet>
    )
}

export default ProductSheet