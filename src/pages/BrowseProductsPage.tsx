import { Select, Table } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "react-query";

import QuantitySelector from "../components/QuantitySelector";
import { Category, Product } from "../entities";

import "react-loading-skeleton/dist/skeleton.css";

function BrowseProducts() {
  const categoryQuery = useQuery<Category[], Error>({
    queryKey: ['category'],
    queryFn: () => axios.get<Category[]>('/categories').then(res => res.data)
  })

  const productQuery = useQuery<Product[], Error>({
    queryKey: ['product'],
    queryFn: () => axios.get<Product[]>('/products').then(res => res.data)
  })

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  const renderCategories = () => {
    const { data: categories, isLoading, error } = categoryQuery;

    if (isLoading) return (
      <div role="progressbar" aria-label="Loading Categories">
        <Skeleton />
      </div>);

    if (error) return null;

    return (
      <Select.Root
        onValueChange={(categoryId) =>
          setSelectedCategoryId(parseInt(categoryId))
        }
      >
        <Select.Trigger placeholder="Filter by Category" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Category</Select.Label>
            <Select.Item value="all">All</Select.Item>
            {categories?.map((category, i) => (
              <Select.Item key={category.id} value={category.id.toString()}>
                {category.name + (i + 1)}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    );
  };

  const renderProducts = () => {
    const { data: products, isLoading, error } = productQuery;
    const skeletons = [1, 2, 3, 4, 5];

    if (error) return <div>Error: {error.message}</div>;

    const visibleProducts = selectedCategoryId
      ? products!.filter((p) => p.categoryId === selectedCategoryId)
      : products;

    return (
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading &&
            <div role="progressbar" aria-label="products">
              {skeletons.map((skeleton) => (
                <Table.Row key={skeleton}>
                  <Table.Cell>
                    <Skeleton />
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton />
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton />
                  </Table.Cell>
                </Table.Row>
              ))}
            </div>
          }
          {!isLoading &&
            visibleProducts!.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>${product.price}</Table.Cell>
                <Table.Cell>
                  <QuantitySelector product={product} />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    );
  };

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">{renderCategories()}</div>
      {renderProducts()}
    </div>
  );
}

export default BrowseProducts;
