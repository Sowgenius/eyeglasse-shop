import { Button } from '@/components/ui/button';
import * as D from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { handleImageUpload } from '@/lib/handle-image-upload';
import { useAddProductMutation } from '@/redux/api/products';
import { productSchema } from '@/schema/products-form-schema';
import { ProductSchema } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgePlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { ProductFormFields } from '../../form/product-form-fields';

export function AddProduct() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [addProduct] = useAddProductMutation();
  const { t } = useTranslation('common');

  const loaderText =
    progress === 100 ? t('products.saving') : t('products.uploading', { progress });

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
  });

  return (
    <>
      <D.Dialog open={isOpen} onOpenChange={setIsOpen}>
        <D.DialogTrigger asChild>
          <Button size={'sm'} className="flex gap-2 items-center h-8">
            <BadgePlus className="size-4" />
            {t('products.addNew')}
          </Button>
        </D.DialogTrigger>
        <D.DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[94svh]">
          <D.DialogHeader className="mt-2">
            <D.DialogTitle className="flex gap-2">
              <BadgePlus className="size-5" />
              {t('products.addProduct')}
            </D.DialogTitle>
            <D.DialogDescription className="text-left">
              {t('products.addProductDescription')}
            </D.DialogDescription>
          </D.DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                setIsLoading(true);

                const { image, ...rest } = values;

                const imageSrc = await handleImageUpload(image, setProgress);

                await addProduct({ ...rest, imageSrc } as any);

                setIsOpen(false);
                setIsLoading(false);
                form.reset();
              })}
              className="grid gap-3"
            >
              <ProductFormFields form={form as any} isLoading={isLoading} />

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full mt-3"
              >
                {isLoading ? loaderText : t('common.save')}
              </Button>
            </form>
          </Form>
        </D.DialogContent>
      </D.Dialog>
    </>
  );
}
