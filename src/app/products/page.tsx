import { prisma } from "@/lib/prisma"

const ProductsPage = async() =>{
  const products = await prisma.product.findMany()

  return (
    <main>
      <h1>Products</h1>

      {products.length === 0 ?
        <p>No products found.</p>
       : 
        <ul>
          {products.map((product) =>
            <li key={product.id}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Price: {product.price.toString()}</p>
              <p>Stock: {product.stock}</p>
            </li>
          )}
        </ul>
      }
    </main>
  )
}

export default ProductsPage