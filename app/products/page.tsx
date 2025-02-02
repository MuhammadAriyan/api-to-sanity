import { client } from '@/sanity/lib/client';
import React from 'react';

const page = async () => {
    const triggerImport = async () => {
        const response = await fetch('/api/importProducts', { method: 'POST' });
        const data = await response.json();
        console.log(data.message);
      };
      triggerImport()
    const products = await client.fetch('*[_type == "product"]')
    console.log(await products);
    return (
        <div className='text-white'>
            {products.map((product:any,index:number) =>
                <div key={index}>
                    {product.name}
                </div>
            )}
        </div>
    );
}

export default page;
