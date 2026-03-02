import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GENDERS,
  HINGES,
  MATERIALS,
  SHAPES,
} from '@/constants/product-constants';
import { decryptUrl } from '@/lib/encryption';
import { isFromCloudinary } from '@/lib/is-from-cloudinary';
import { cn } from '@/lib/utils';
import { ProductSchema } from '@/types/product';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  form: UseFormReturn<any>;
  isLoading: boolean;
  defaultImgSrc?: string;
};

export function ProductFormFields({
  form,
  isLoading,
  defaultImgSrc = '',
}: Props) {
  const { t } = useTranslation('common');
  const src = defaultImgSrc ? decryptUrl(defaultImgSrc) : '';
  const [imgSrc, setImgSrc] = useState<any>(src);

  const [imgInputKey, setImgInputKey] = useState(0);

  return (
    <div className="grid sm:grid-cols-2 gap-1.5 sm:gap-3">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.productName')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('products.productName')}
                type="text"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="reference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.reference') || 'Reference'}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('products.reference') || 'Reference number'}
                type="text"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.brandName')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('products.brand')}
                type="text"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.price')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('products.price')}
                type="number"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.quantity')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('products.quantity')}
                type="number"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="frame.material"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.frameMaterial')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger disabled={isLoading}>
                  <SelectValue placeholder={t('products.frameMaterial')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {MATERIALS.map((material) => (
                  <SelectItem
                    key={material}
                    value={material}
                    className="capitalize"
                  >
                    {material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="frame.shape"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.frameShape')}</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger disabled={isLoading}>
                  <SelectValue placeholder={t('products.frameShape')} />
                </SelectTrigger>

                <SelectContent>
                  {SHAPES.map((shape) => (
                    <SelectItem
                      key={shape}
                      value={shape}
                      className="capitalize"
                    >
                      {shape}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hinge_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.hingeType')}</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger disabled={isLoading}>
                  <SelectValue placeholder={t('products.hingeType')} />
                </SelectTrigger>

                <SelectContent>
                  {HINGES.map((hinge) => (
                    <SelectItem
                      key={hinge}
                      value={hinge}
                      className="capitalize"
                    >
                      {hinge}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lens_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.lensType')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('products.lensType')}
                type="text"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.gender')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger disabled={isLoading}>
                  <SelectValue placeholder={t('products.gender')} />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {GENDERS.map((gender) => (
                  <SelectItem
                    key={gender}
                    value={gender}
                    className="capitalize"
                  >
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.color')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('products.color')}
                type="text"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="temple_length"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.templeLength')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('products.templeLength')}
                type="number"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bridge_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('products.bridgeSize')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('products.bridgeSize')}
                type="number"
                disabled={isLoading}
                className="transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>{t('products.productImage')}</FormLabel>
            <FormControl>
              <Input
                accept=".jpg, .jpeg, .png, .svg, .webp"
                type="file"
                key={imgInputKey}
                disabled={isLoading}
                onChange={(e) => {
                  field.onChange(e.target.files ? e.target.files[0] : null);

                  if (e.target.files) {
                    const reader = new FileReader();
                    reader.readAsDataURL(e.target.files[0]);
                    reader.onload = (e) => setImgSrc(e.target?.result);
                  }
                }}
              />
            </FormControl>
            <FormMessage />

            {(imgSrc.startsWith('data:image') || isFromCloudinary(imgSrc)) && (
              <div
                className={cn(
                  'border rounded-md overflow-hidden max-w-full relative',
                  {
                    'opacity-50': isLoading,
                  }
                )}
              >
                <Image
                  className="object-cover object-center aspect-[6/4]"
                  src={imgSrc}
                  width={500}
                  height={333}
                  alt="Preview image"
                />

                {imgSrc.startsWith('data:image') && (
                  <button
                    className="absolute top-2 right-2 bg-white border p-1 rounded shadow-sm group"
                    onClick={() => {
                      form.resetField('image');
                      setImgInputKey((prev) => prev + 1);
                      setImgSrc(src);
                    }}
                  >
                    <span className="sr-only">{t('common.unselectImage')}</span>
                    <X className="size-3 stroke-gray-500 group-hover:stroke-gray-800" />
                  </button>
                )}
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
