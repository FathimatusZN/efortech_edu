'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


const PAGE_SIZE = 10;

export default function PartnerTable({ partner = [], onDeletePartner }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(partner.length / PAGE_SIZE);
  const paginatedData = partner.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (partnerId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partner/delete/${partnerId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete partner');
      }

      onDeletePartner(); 
    } catch (error) {
      console.error('Failed to delete partner', error);
    }
  };

  return (
    <div>
      {paginatedData.length === 0 ? (
        <p className="text-center text-gray-500 py-4">Belum ada data partner.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.partner_id}>
                  <TableCell>
                    <div className="flex justify-center items-center">
                      {item.partner_logo ? (
                        <Image
                          src={item.partner_logo}
                          alt="Logo"
                          width={40}
                          height={40}
                          className="object-contain rounded"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No logo</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.partner_name}</TableCell>
                  <TableCell>{item.category === 1 ? 'Institution' : 'College'}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border 
                          ${item.status === 1
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : 'bg-gray-100 text-gray-500 border-gray-300'}`}
                    >
                      {item.status === 1 ? 'Active' : 'Archived'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-2">
                      <Link href={`/partner-admin/form-partner?id=${item.partner_id}`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Partner</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this partner? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(item.partner_id)}
                              >
                                Delete
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {partner.length > PAGE_SIZE && (
        <>
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((prev) => Math.max(prev - 1, 1));
                    }}
                    className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((prev) => Math.min(prev + 1, totalPages));
                    }}
                    className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div className="text-xs text-gray-600 text-center mt-2">
            Menampilkan {(page - 1) * PAGE_SIZE + 1} hingga{' '}
            {Math.min(page * PAGE_SIZE, partner.length)} dari {partner.length} partner
          </div>
        </>
      )}
    </div>
  );
}
