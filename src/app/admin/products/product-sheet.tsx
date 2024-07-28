import React, { use } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet'
import CreateProductForm ,{ FormValues }  from './create-product-form'
import { CreateProduct } from '@/http/api'
import { useMutation,useQueryClient } from '@tanstack/react-query'
import {useNewProductStore} from '@/store/product/product-store'
import { useToast } from "@/components/ui/use-toast"



const ProductSheet = () => {

    const {toast} = useToast()

    const {onClose,isOpen} =useNewProductStore()

    const queryClient = useQueryClient();

    const {mutate,isPending} = useMutation({
        mutationKey:[ 'create-product'],
        mutationFn: (data: FormData) => CreateProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']})
            toast({
                title: 'Product created successfully',
            }) 
            onClose()
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
                } disabled={isPending} />
            </SheetContent>
        </Sheet>
    )
}

export default ProductSheet