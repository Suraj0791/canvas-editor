export default function CanvasPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <p>Canvas Scene: {params.id}</p>
    </div>
  )
}